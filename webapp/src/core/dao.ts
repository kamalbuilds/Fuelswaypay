import { FormInstance } from 'antd';
import { Address, ContractFactory } from 'fuels';
import { DaoContractAbi__factory } from 'src/contracts/dao';
import { setDaoFormProps, updateDaoFormState } from 'src/controller/dao/daoFormSlice';
import { setDaoProps } from 'src/controller/dao/daoSlice';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';
import { store } from "src/controller/store";
import { TAI64 } from 'tai64';
import { setDaoDetailProps, setMembers, setProposals, setTreasury } from 'src/controller/dao/daoDetailSlice';
import {
    MESSAGE_TYPE,
    openNotification,
    updateStatistic
} from "./common";
import { ZERO_B256, provider } from './constant';
import { AddressInput, IdentityInput } from 'src/contracts/dao/DaoContractAbi';

export const saveDAO = async (formValues) => {
    let { account } = store.getState();
    if (account.account) {
        try {
            let request = await fetch("/api/dao/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formValues,
                    open: formValues.open === 2 ? true : false,
                    owner: account.account,
                    members: JSON.stringify(formValues.members),
                    whitelist: JSON.stringify(formValues.whitelist),
                })
            })

            let result = await request.json()
            openNotification("Save DAO", `"${formValues.title}" was saved successful`, MESSAGE_TYPE.SUCCESS, () => { })
            return result;
        } catch (e) {
            return false;
        }
    }
}

export const updateDAO = async (formValues) => {
    let { account, daoForm } = store.getState();
    if (account.account) {
        try {
            let request = await fetch("/api/dao/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formValues,
                    _id: daoForm._id,
                    open: formValues.open === 2 ? true : false,
                    owner: account.account,
                    members: JSON.stringify(formValues.members),
                    whitelist: JSON.stringify(formValues.whitelist),
                })
            })

            let result = await request.json()

            if (result.success) {
                openNotification("Save DAO", `"${formValues.title}" was updated successful`, MESSAGE_TYPE.SUCCESS, () => { })
                return true;
            }
        } catch (e) {
            return false;
        }
    }
}

export const getDaoDetailFromDB = async (_id: string | string[], form: FormInstance<any>) => {
    try {
        let request = await fetch("/api/dao/getById", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: _id
            })
        })

        let result = await request.json();
        let merged_result = {
            ...result,
            members: JSON.parse(result.members),
            voting_mode: result.quorum == 100 ? 1 : 2,
            open: result.open ? 2 : 1,
            whitelist: JSON.parse(result.whitelist),
        }
        form.setFieldsValue(merged_result);
        store.dispatch(updateDaoFormState({ _id: result._id, status: result.status, address: result.address }))
    } catch (e) {
        return false;
    }
}

export const deployDAO = async (name: string, form: FormInstance<any>) => {
    const { account } = store.getState().account;
    const { _id } = store.getState().daoForm;
    if (window.fuel && account) {
        try {
            store.dispatch(updateProcessStatus({
                actionName: actionNames.deployDao,
                att: processKeys.processing,
                value: true
            }))

            let request = await fetch("/api/contract/getFiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name
                })
            })

            let result = await request.json();
            let wallet = await window.fuel.getWallet(account);
            const factory = new ContractFactory(result.binFile.data, JSON.parse(result.jsonFile), wallet);

            const contract = await factory.deployContract();

            let contractId = contract.id.toB256();

            // Update 

            let updateRequest = await fetch("/api/dao/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: account,
                    _id: _id,
                    address: contractId,
                    status: 0
                })
            })
            store.dispatch(setDaoFormProps({ att: "status", value: 0 }))
            let updateRes = await updateRequest.json()


            openNotification("Deploy DAO", `DAO was deployed successful with contract id: ${contractId}`, MESSAGE_TYPE.SUCCESS, () => { })

            if (updateRes.success) {
                await initializeDAO(contractId, form);
            }

        } catch (e) {
            console.log(e);
            openNotification("Deploy DAO", e.message, MESSAGE_TYPE.ERROR, () => { })
        }
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.deployDao,
        att: processKeys.processing,
        value: false
    }))
}

export const initializeDAO = async (contractId: string, form: FormInstance<any>) => {
    const { account } = store.getState().account;
    const { _id } = store.getState().daoForm;
    if (window.fuel && account) {
        try {
            store.dispatch(updateProcessStatus({
                actionName: actionNames.initializeDao,
                att: processKeys.processing,
                value: true
            }))
            let wallet = await window.fuel.getWallet(account);
            const daoContract = DaoContractAbi__factory.connect(contractId, wallet);
            const members = form.getFieldValue("members");
            const whitelist = form.getFieldValue("whitelist");
            let open = form.getFieldValue("open");
            let quorum = form.getFieldValue("quorum");
            let memberAddresses = members.map(m => ({ value: new Address(m.address) }));
            if (members.length < 5) {
                for (let i = members.length; i < 5; i++) {
                    memberAddresses[i] =
                        { value: Address.fromB256(ZERO_B256) }
                }
            }

            let contributors = whitelist.map(m => {
                if (m.type == 1) {
                    return { Address: { value: new Address(m.address).toB256() } }
                } else {
                    return { ContractId: { value: m.address } }
                }
            });

            if (contributors.length < 5) {
                for (let i = contributors.length; i < 5; i++) {
                    contributors[i] = { Address: { value: ZERO_B256 } }
                }
            }

            await daoContract.functions.initialize(
                {
                    open: open === 2 ? true : false,
                    quorum: quorum,
                    dao_type: 1
                },
                memberAddresses,
                contributors

            ).txParams({ gasPrice: 1 }).call();

            let updateRequest = await fetch("/api/dao/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: account,
                    _id: _id,
                    address: contractId,
                    status: 1
                })
            })
            let updateRes = await updateRequest.json();
            if (updateRes.success) {
                openNotification("Initialized DAO", `DAO was initialized successful`, MESSAGE_TYPE.SUCCESS, () => { })
                store.dispatch(setDaoFormProps({ att: "status", value: 1 }));
            }
        } catch (e) {
            console.log(e);
            openNotification("Initialized DAO", e.message, MESSAGE_TYPE.ERROR, () => { })
        }

    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.deployDao,
        att: processKeys.processing,
        value: false
    }))

}

export const getDaos = async () => {
    try {


        let getReq = await fetch("/api/dao/getAllDao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: 1
            })
        })
        let getRes = await getReq.json();

        store.dispatch(setDaoProps({ att: "daos", value: getRes }))

    } catch (e) {
        console.error(e)
    }

}

export const getOwnerDaos = async () => {
    try {
        const { account } = store.getState().account;
        if (window.fuel && account) {

            let getReq = await fetch("/api/dao/getList", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: account
                })
            })
            let getRes = await getReq.json();
            store.dispatch(setDaoProps({ att: "ownerDaos", value: getRes }))
        }

    } catch (e) {
        console.error(e)
    }

}


export const getDaoDetail = async (_id: string | string[]) => {
    try {
        let getReq = await fetch("/api/dao/getById", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: _id
            })
        })
        let daoFromDB = await getReq.json();
        const contract = await DaoContractAbi__factory.connect(daoFromDB.address, provider);
        const { value } = await contract.functions.get_dao_info().get();

        let daoOnchain = {
            quorum: value[0].quorum.toNumber(),
            open: value[0].open,
            dao_type: value[0].dao_type.toNumber(),
            owner: Address.fromAddressOrString(value[1].value).toString(),
            status: value[2].toNumber(),
            count_proposal: value[3].toNumber(),
            count_member: value[4].toNumber(),
            balance: value[5].toNumber() / 10 ** 9,
            created_date: new Date(TAI64.fromHexString(value[6].toHex()).toUnix() * 1000).toLocaleString()
        };

        store.dispatch(setDaoDetailProps({ daoFromDB: daoFromDB, daoOnChain: daoOnchain }));

    } catch (e) {
        console.error(e)
    }

}

export const fundDao = async (amount: number) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        let { daoFromDB } = store.getState().daoDetail;
        if (daoFromDB) {
            if (amount > 0) {
                store.dispatch(updateProcessStatus({
                    actionName: actionNames.addFund,
                    att: processKeys.processing,
                    value: true
                }))

                let wallet = await window.fuel.getWallet(account);
                const daoContract = DaoContractAbi__factory.connect(daoFromDB.address, wallet);

                await daoContract.functions.send_fund(
                ).txParams({ gasPrice: 1 }).callParams({ forward: { amount: amount * 10 ** 9 } }).call();

                updateStatistic("fund", amount);
                openNotification("Add Fund", `Add ${amount} ETH successful`, MESSAGE_TYPE.SUCCESS, () => { })
                getDaoDetail(daoFromDB._id);
                getContributorFunds(0);
            }
        }
    } catch (e) {
        openNotification("Add Fund", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.addFund,
        att: processKeys.processing,
        value: false
    }))
}


export const getDaoProposals = async (daoAddress: string) => {
    try {
        let getReq = await fetch("/api/proposal/getByDAO", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dao_address: daoAddress
            })
        })
        let proposals = await getReq.json();

        store.dispatch(setProposals(proposals));

    } catch (e) {
        openNotification("Get Proposal", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

}


export const addMember = async (address: `fuel${string}`) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        let { daoFromDB } = store.getState().daoDetail;
        if (daoFromDB) {
            store.dispatch(updateProcessStatus({
                actionName: actionNames.addMember,
                att: processKeys.processing,
                value: true
            }))


            let wallet = await window.fuel.getWallet(account);
            const daoContract = DaoContractAbi__factory.connect(daoFromDB.address, wallet);

            await daoContract.functions.add_member(
                { value: new Address(address).toB256() }
            ).txParams({ gasPrice: 1 }).call();


            updateStatistic("members", 1);
            openNotification("Add Member", `Add new member "${address}" successful`, MESSAGE_TYPE.SUCCESS, () => { })
            getDaoDetail(daoFromDB._id);
            getMembers(0);
        }
    } catch (e) {
        openNotification("Add Member", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.addMember,
        att: processKeys.processing,
        value: false
    }))
}

export const removeMember = async (address: any) => {
    try {
        const { account } = store.getState().account;
        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        let { daoFromDB } = store.getState().daoDetail;
        if (daoFromDB) {
            store.dispatch(updateProcessStatus({
                actionName: actionNames.removeMember,
                att: processKeys.processing,
                value: true
            }))

            let wallet = await window.fuel.getWallet(account);
            const daoContract = DaoContractAbi__factory.connect(daoFromDB.address, wallet);

            await daoContract.functions.remove_member(
                { value: new Address(address).toB256() }
            ).txParams({ gasPrice: 1 }).call();

            updateStatistic("members", -1);
            openNotification("Remove Member", `Remove member "${address}" successful`, MESSAGE_TYPE.SUCCESS, () => { });

            getDaoDetail(daoFromDB._id);
            getMembers(0);

        }





    } catch (e) {
        openNotification("Remove Member", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.removeMember,
        att: processKeys.processing,
        value: false
    }))

}
// export const joinDao = async (wallet: any, daoId: string) => {
//     try {

//         if (!wallet.connected) {
//             openNotification("SUI wallet is not currently connected.", `To utilize SDAO features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
//             return;
//         }


//         updateStatistic("members", 1);
//         openNotification("Join Dao", `You joined successful`, MESSAGE_TYPE.SUCCESS, () => { })

//     } catch (e) {
//         openNotification("Join Dao", e.message, MESSAGE_TYPE.ERROR, () => { })
//     }

//     store.dispatch(updateProcessStatus({
//         actionName: actionNames.join,
//         att: processKeys.processing,
//         value: false
//     }))
// }

// export const leaveDao = async (wallet: any) => {
//     try {

//         store.dispatch(updateProcessStatus({
//             actionName: actionNames.join,
//             att: processKeys.processing,
//             value: true
//         }))

//         updateStatistic("members", -1);
//         openNotification("Leave Dao", `You left successful`, MESSAGE_TYPE.SUCCESS, () => { })
//         store.dispatch(setDaoDetailProps({ att: "refreshDAO", value: refreshDAO + 1 }))
//     } catch (e) {
//         openNotification("Leave Dao", e.message, MESSAGE_TYPE.ERROR, () => { })
//     }

//     store.dispatch(updateProcessStatus({
//         actionName: actionNames.leave,
//         att: processKeys.processing,
//         value: false
//     }))
// }


// const updateDaoStatus = async (status: number) => {
//   let currentDaoAddress = store.getState().daoDetail.currentDaoAddress;
//   if (currentDaoAddress) {

//     console.log(tx.decodedResult);

//   }
// }

export const getMembers = async (offset: number) => {
    try {
        let { daoFromDB } = store.getState().daoDetail;
        const contract = await DaoContractAbi__factory.connect(daoFromDB.address, provider);
        const value = (await contract.functions.get_members(offset).get()).value;
        const addressInputs: AddressInput[] = value.filter(i => !!i);
        const addresses = addressInputs.map(a => Address.fromAddressOrString(a.value).toString());
        store.dispatch(setMembers(addresses));
    } catch (e) {
        console.log(e)
    }

}

export const getContributorFunds = async (offset: number) => {
    try {
        let { daoFromDB } = store.getState().daoDetail;
        const contract = await DaoContractAbi__factory.connect(daoFromDB.address, provider);
        const whitelistContributors = (await contract.functions.get_whitelist_contributors(offset).get()).value;
        let identityInputs: IdentityInput[] = whitelistContributors.filter(i => !!i);

        if (identityInputs.length < 5) {
            for (let i = identityInputs.length; i < 5; i++) {
                identityInputs[i] = { Address: { value: ZERO_B256 } }
            }
        } else {
            identityInputs = identityInputs.slice(0, 5);
        }

        const funds = (await contract.functions.get_funds(
            [
                identityInputs[0],
                identityInputs[1],
                identityInputs[2],
                identityInputs[3],
                identityInputs[4],
            ]
        ).get()).value;

        let contributorFunds = [];

        for (let i = 0; i < funds.length; i++) {

            if (funds[i]) {

                if (identityInputs[i].Address) {
                    contributorFunds.push({
                        address: Address.fromAddressOrString(identityInputs[i].Address.value).toString(),
                        amount: funds[i].toNumber() / 10 ** 9
                    })
                } else {
                    contributorFunds.push({
                        address: identityInputs[i].ContractId.value,
                        amount: funds[i].toNumber() / 10 ** 9
                    })
                }

            }
        }

        store.dispatch(setTreasury(contributorFunds));
    } catch (e) {
        console.log(e)
    }

}