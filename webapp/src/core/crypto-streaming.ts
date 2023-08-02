import { store } from "src/controller/store";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { Address, ContractFactory } from 'fuels';
import {
    MESSAGE_TYPE,
    openNotification,
    updatePayout,
    updateStatistic
} from "./common";
import { calculateUnlockEvery } from "./utils";
import { setCreateStreamProps } from "src/controller/stream/createStreamSlice";
import { CryptoStreamingContractAbi__factory } from "src/contracts/crypto-streaming";
import { TAI64 } from "tai64";
import { Stream, setStreamProps } from "src/controller/stream/streamSlice";
import moment from "moment";

export const createStream = async (formValues) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        let wallet = await window.fuel.getWallet(account);

        store.dispatch(updateProcessStatus({
            actionName: actionNames.createStream,
            att: processKeys.processing,
            value: true
        }))

        let request = await fetch("/api/contract/getFiles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "crypto-streaming"
            })
        })

        let result = await request.json();
        const factory = new ContractFactory(result.binFile.data, JSON.parse(result.jsonFile), wallet);

        const contract = await factory.deployContract();

        let contractId = contract.id.toB256();

        let saveStreamRq = await fetch("/api/stream/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...formValues,
                owner: account,
                address: contractId,
                start_date: Date.parse(formValues.start_date),
                status: 0,
                total_fund: 0
            })
        })

        let saveStreamRes = await saveStreamRq.json();

        updateStatistic("stream", 1);

        store.dispatch(setCreateStreamProps({ att: "status", value: 1 }));

        await initializeStream(saveStreamRes._id, contractId, formValues);

        store.dispatch(setCreateStreamProps({ att: "status", value: 2 }));

        openNotification("Create Stream", `Create Stream Successful`, MESSAGE_TYPE.SUCCESS, () => { })

    } catch (e) {
        openNotification("Create Stream", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createStream,
        att: processKeys.processing,
        value: false
    }))
}

export const initializeStream = async (_id: string, streamAddress: string, formValues: any) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        let wallet = await window.fuel.getWallet(account);


        let startDate = TAI64.fromUnix(
            Math.floor(Date.parse(formValues.start_date) / 1000)
        );
        const streamContract = await CryptoStreamingContractAbi__factory.connect(streamAddress, wallet);

        await streamContract.functions.initialize(
            {
                start_date: "0x" + startDate.toHexString(),
                cancel_previlege: formValues.cancel_previlege,
                transfer_previlege: formValues.transfer_previlege,
                recipient: { Address: { value: Address.fromString(formValues.recipient).toB256() } },
                unlock_number: formValues.unlock_number,
                unlock_amount_each_time: formValues.unlock_amount_each_time * 10 ** 9,
                unlock_every: calculateUnlockEvery(formValues.unlock_every, formValues.unlock_every_type),
                prepaid: formValues.unlock_amount_each_time.prepaid * 10 ** 9
            }
        ).txParams({ gasPrice: 1 }).call();


        await fetch("/api/stream/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: account,
                _id: _id,
                status: 1,
            })
        })


    } catch (e) {
        throw e;
    }
}

export const getIncomingStreams = async () => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        let streamsReq = await fetch("/api/stream/getIncoming", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipient: account
            })
        })

        let streamsRes = await streamsReq.json();

        store.dispatch(setStreamProps({ att: "incomingStreams", value: streamsRes }));

    } catch (e) {
        console.error(e)
    }
}

export const getOutgoingStreams = async () => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        let streamsReq = await fetch("/api/stream/getOutgoing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: account
            })
        })

        let streamsRes = await streamsReq.json();

        store.dispatch(setStreamProps({ att: "outgoingStreams", value: streamsRes }));

    } catch (e) {
        console.error(e)
    }
}



export const fundStream = async (stream: Stream, amount: number) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }


        if (amount > 0) {
            store.dispatch(updateProcessStatus({
                actionName: actionNames.fundStream,
                att: processKeys.processing,
                value: true
            }))

            let wallet = await window.fuel.getWallet(account);

            const streamContract = await CryptoStreamingContractAbi__factory.connect(stream.address, wallet);

            await streamContract.functions.send_fund()
                .txParams({ gasPrice: 1 })
                .callParams({ forward: { amount: amount * 10 ** 9 } })
                .call();

            await fetch("/api/stream/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: account,
                    _id: stream._id,
                    total_fund: stream.total_fund + amount
                })
            })

            updateStatistic("fund", amount);
            openNotification("Add Fund", `Add ${amount} ETH successful`, MESSAGE_TYPE.SUCCESS, () => { })
            getOutgoingStreams();
        }

    } catch (e) {
        openNotification("Add Fund", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.fundStream,
        att: processKeys.processing,
        value: false
    }))
}


export const withdrawStream = async (stream: Stream) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        
        store.dispatch(updateProcessStatus({
            actionName: actionNames.withdrawStream,
            att: processKeys.processing,
            value: true
        }))

        let wallet = await window.fuel.getWallet(account);
      
        const streamContract = await CryptoStreamingContractAbi__factory.connect(stream.address, wallet);
        const balanceBefore = await streamContract.functions.get_balance().get();

        await streamContract.functions.withdraw()
            .txParams({ gasPrice: 1 })
            .call();

        const {value} = await streamContract.functions.get_stream_info().get();

        await fetch("/api/stream/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: stream.owner,
                _id: stream._id,
                withdrew: value[2].toNumber() / 10**9,
                status: value[1].toNumber()
            })
        })
        updatePayout("payout",  (balanceBefore.value.toNumber() - value[4].toNumber()) / 10**9, moment().format('YYYY-MM-DD'));
        openNotification("Withdraw", `Withdraw successful`, MESSAGE_TYPE.SUCCESS, () => { })
        getIncomingStreams();

    } catch (e) {
        openNotification("Withdraw Fund", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.withdrawStream,
        att: processKeys.processing,
        value: false
    }))
}

export const cancelStreamAction = async (stream: Stream) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        
        store.dispatch(updateProcessStatus({
            actionName: actionNames.cancelStream,
            att: processKeys.processing,
            value: true
        }))

        let wallet = await window.fuel.getWallet(account);
      
        const streamContract = await CryptoStreamingContractAbi__factory.connect(stream.address, wallet);

        await streamContract.functions.cancel_stream()
            .txParams({ gasPrice: 1 })
            .call();

        await fetch("/api/stream/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: stream.owner,
                _id: stream._id,
                withdrew: stream.total_fund,
                status: 3
            })
        })

        openNotification("Cancel Stream", `Cancel Stream successful`, MESSAGE_TYPE.SUCCESS, () => { });
        if (account === stream.recipient) {
            getIncomingStreams();
        } else {
            getOutgoingStreams();
        }
   

    } catch (e) {
        openNotification("Cancel Stream", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.cancelStream,
        att: processKeys.processing,
        value: false
    }))
}

export const transferStreamAction = async (stream: Stream, newRecipient: `fuel${string}`) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        
        store.dispatch(updateProcessStatus({
            actionName: actionNames.transferStream,
            att: processKeys.processing,
            value: true
        }))

        let wallet = await window.fuel.getWallet(account);
      
        const streamContract = await CryptoStreamingContractAbi__factory.connect(stream.address, wallet);
        const balanceBefore = await streamContract.functions.get_balance().get();

        await streamContract.functions.transfer_stream({Address: {value: Address.fromString(newRecipient).toB256()}})
            .txParams({ gasPrice: 1 })
            .call();

        const {value} = await streamContract.functions.get_balance().get();

        await fetch("/api/stream/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: stream.owner,
                _id: stream._id,
                withdrew: stream.total_fund - value.toNumber()/10**9,
            })
        })
        updatePayout("payout",  (balanceBefore.value.toNumber() - value.toNumber()) / 10**9, moment().format('YYYY-MM-DD'));
        openNotification("Transfer  Stream", `Transfer Stream successful`, MESSAGE_TYPE.SUCCESS, () => { });
        if (account === stream.recipient) {
            getIncomingStreams();
        } else {
            getOutgoingStreams();
        }
   

    } catch (e) {
        openNotification("Transfer Stream", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.transferStream,
        att: processKeys.processing,
        value: false
    }))
}