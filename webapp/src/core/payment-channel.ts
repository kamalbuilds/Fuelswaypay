import { PaymentChannelContractAbi__factory } from "src/contracts/payment-channel";
import { Address, ContractFactory, Signer, hashMessage, hash, WalletUnlocked } from 'fuels';
import { Channel, Claim, setChannelProps } from "src/controller/channel/channelSlice";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { store } from "src/controller/store";
import {
    MESSAGE_TYPE,
    openNotification,
    updatePayout,
    updateStatistic
} from "./common";
import { setCreateChannelProps } from "src/controller/channel/createChannelSlice";
import { provider } from "./constant";
import moment from "moment";


export const createChannel = async (formValues: {
    title: string,
    description: string,
    payee: string
}) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.createChannel,
            att: processKeys.processing,
            value: true
        }))
        let wallet = await window.fuel.getWallet(account);

        let request = await fetch("/api/contract/getFiles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "payment-channel"
            })
        })

        let result = await request.json();
        const factory = new ContractFactory(result.binFile.data, JSON.parse(result.jsonFile), wallet);

        const contract = await factory.deployContract();

        let contractId = contract.id.toB256();

        let saveChannelRq = await fetch("/api/channel/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...formValues,
                payer: account,
                address: contractId,
                status: 0,
                total_fund: 0.0,
                nonce: 0
            })
        })

        let saveChannelRes = await saveChannelRq.json();

        updateStatistic("channel", 1);

        store.dispatch(setCreateChannelProps({ att: "status", value: 1 }));

        await initializeStream(saveChannelRes._id, contractId, formValues);

        store.dispatch(setCreateChannelProps({ att: "status", value: 2 }));


        openNotification("Create Channel", `Create Channel Successful`, MESSAGE_TYPE.SUCCESS, () => { });

    } catch (e) {
        console.log(e);
        openNotification("Create Channel", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createChannel,
        att: processKeys.processing,
        value: false
    }))
}

export const initializeStream = async (_id: string, channelAddress: string, formValues: any) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }


        let wallet = await window.fuel.getWallet(account);

        const channelContract = await PaymentChannelContractAbi__factory.connect(channelAddress, wallet);

        await channelContract.functions.initialize(
            { value: new Address(formValues.payee).toB256() }
        ).txParams({ gasPrice: 1 }).call();


        await fetch("/api/channel/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payer: account,
                _id: _id,
                status: 1,
            })
        })


    } catch (e) {
        throw e;
    }
}

export const getIncomingChannels = async () => {
    try {

        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        let channelReq = await fetch("/api/channel/getIncoming", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payee: account
            })
        })

        let channelRes = await channelReq.json();

        store.dispatch(setChannelProps({ att: "incomingChannels", value: channelRes }));

    } catch (e) {
        console.error(e)
    }
}

export const getOutgoingChannels = async () => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        let channelReq = await fetch("/api/channel/getOutgoing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payer: account
            })
        })

        let channelRes = await channelReq.json();

        store.dispatch(setChannelProps({ att: "outgoingChannels", value: channelRes }));

    } catch (e) {
        console.error(e)
    }
}

export const fundChannel = async (channel: Channel, amount: number) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        if (amount > 0) {
            store.dispatch(updateProcessStatus({
                actionName: actionNames.fundChannel,
                att: processKeys.processing,
                value: true
            }))
            let wallet = await window.fuel.getWallet(account);

            const streamContract = await PaymentChannelContractAbi__factory.connect(channel.address, wallet);

            await streamContract.functions.send_fund()
                .txParams({ gasPrice: 1 })
                .callParams({ forward: { amount: amount * 10 ** 9 } })
                .call();

            await fetch("/api/channel/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payer: account,
                    _id: channel._id,
                    total_fund: channel.total_fund + amount
                })
            })
            updateStatistic("fund", amount);
            openNotification("Add Fund", `Add ${amount} ETH successful`, MESSAGE_TYPE.SUCCESS, () => { });

            getOutgoingChannels();
        }

    } catch (e) {
        openNotification("Add Fund", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.fundChannel,
        att: processKeys.processing,
        value: false
    }))
}

export const createClaim = async (channel: Channel, formValues: {
    title: string,
    meta_url: string,
    amount: number
}) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        if (formValues.amount > 0) {

            store.dispatch(updateProcessStatus({
                actionName: actionNames.createClaim,
                att: processKeys.processing,
                value: true
            }))

            const channelContract = await PaymentChannelContractAbi__factory.connect(channel.address, provider);
            const { value } = await channelContract.functions.get_hash(
                formValues.amount * 10 ** 9,
                channel.nonce + 1,
                { value: new Address(channel.payee).toB256() }
            ).get();

            let wallet = await window.fuel.getWallet(account);

            let signature = await wallet.signMessage(value);

            await fetch("/api/claim/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formValues,
                    nonce: channel.nonce + 1,
                    payer: channel.payer,
                    payee: channel.payee,
                    channel_address: channel.address,
                    status: 1,
                    amount: formValues.amount,
                    hash: value,
                    signature: signature
                })
            })



            fetch("/api/channel/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payer: account,
                    _id: channel._id,
                    nonce: channel.nonce + 1
                })
            })
            updateStatistic("claim", 1);
            openNotification("Create Claim", `Create Claim Successful`, MESSAGE_TYPE.SUCCESS, () => { })
        }



    } catch (e) {
        console.log(e);
        openNotification("Create Claim", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createClaim,
        att: processKeys.processing,
        value: false
    }))
}
export const getClaims = async (channel: Channel) => {
    try {

        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        let claimsRq = await fetch("/api/claim/getListByChannel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                channel_address: channel.address
            })
        })

        let claimRes = await claimsRq.json();

        store.dispatch(setChannelProps({ att: "currentClaims", value: claimRes }));

    } catch (e) {
        console.error(e)
    }
}

export const acceptClaim = async (claim: Claim) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.acceptClaim,
            att: processKeys.processing,
            value: true
        }))


        let wallet = await window.fuel.getWallet(account);

        const channelContract = await PaymentChannelContractAbi__factory.connect(claim.channel_address, wallet);

        await channelContract.functions.claim_payment(
            hashMessage(claim.hash),
            claim.amount * 10 ** 9,
            claim.nonce,
            claim.signature
        )
            .txParams({ gasPrice: 1 })
            .call();
        // Update claim

        fetch("/api/claim/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: claim._id,
                payer: claim.payer,
                status: 2
            })
        })

        // Update channel
        updatePayout("payout", claim.amount, moment().format('YYYY-MM-DD'));
        openNotification("Accept Claim", `Accept Claim Successful`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Accept Claim", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.acceptClaim,
        att: processKeys.processing,
        value: false
    }))
}


export const rejectClaim = async (wallet: any, claim: Claim) => {
    try {
        if (wallet.connected) {

            store.dispatch(updateProcessStatus({
                actionName: actionNames.rejectClaim,
                att: processKeys.processing,
                value: true
            }))


            openNotification("Accept Claim", `Accept Claim Successful`, MESSAGE_TYPE.SUCCESS, () => { })
        }
    } catch (e) {
        openNotification("Create Claim", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.rejectClaim,
        att: processKeys.processing,
        value: false
    }))
}

export const closeChannel = async (wallet: any, channelId: string) => {
    try {
        if (wallet.connected) {


            store.dispatch(updateProcessStatus({
                actionName: actionNames.closeChannel,
                att: processKeys.processing,
                value: true
            }))



            openNotification("Close Channel", `Close Channel Successful`, MESSAGE_TYPE.SUCCESS, () => { })
        }
    } catch (e) {
        openNotification("Create Claim", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.closeChannel,
        att: processKeys.processing,
        value: false
    }))
}