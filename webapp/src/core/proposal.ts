import { Address } from "fuels";
import { DaoContractAbi__factory } from 'src/contracts/dao';
import { IdentityInput } from 'src/contracts/dao/DaoContractAbi';
import { setProposalDetailProps } from 'src/controller/dao/proposalSlice';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';
import { store } from "src/controller/store";
import { TAI64 } from 'tai64';
import { MESSAGE_TYPE, openNotification, updateStatistic } from "./common";
import { provider } from "./constant";
import { getDaoDetail, getDaoProposals } from "./dao";


export const createPayoutProposal = async (formValues?: {
  title: string,
  content: string,
  content_type: number,
  allow_early_execution: boolean,
  recipient: string,
  amount: number,
  proposal_type: number,
  start_date?: string,
  end_date?: string,
}) => {
  try {
    const { account } = store.getState().account;
    if (!window.fuel || !account) {
      openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
      return;
    }
    let wallet = await window.fuel.getWallet(account);
    let { daoFromDB } = store.getState().daoDetail;
    if (daoFromDB) {
      store.dispatch(updateProcessStatus({
        actionName: actionNames.createProposal,
        att: processKeys.processing,
        value: true
      }))

      let startDate = TAI64.fromUnix(
        Math.floor(Date.parse(formValues.start_date) / 1000)
      );
      let endDate = TAI64.fromUnix(
        Math.floor(Date.parse(formValues.end_date) / 1000)
      );
      const daoContract = DaoContractAbi__factory.connect(daoFromDB.address, wallet);
      let recipient: IdentityInput = { Address: { value: Address.fromString(formValues.recipient).toB256() } };
      if (formValues.proposal_type == 2) {
        recipient = { ContractId: { value: formValues.recipient } };
      }
      let id = await daoContract.functions.create_proposal(
        formValues.proposal_type,
        recipient,
        formValues.amount * 10 ** 9,
        "0x" + startDate.toHexString(),
        "0x" + endDate.toHexString(),
        formValues.allow_early_execution
      ).txParams({ gasPrice: 1 }).call();


      let saveReq = await fetch("/api/proposal/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          start_date: Date.parse(formValues.start_date),
          end_date: Date.parse(formValues.end_date),
          owner: account,
          id: id.value.toNumber(),
          dao_address: daoFromDB.address,
          status: 1
        })
      })

      let saveRes = await saveReq.json();

      if (saveRes.success) {
        return true;
      }


      // updateStatistic("proposal", 1);
      // updatePayout("payout", formValues.amount, moment().format('YYYY-MM-DD'));

      openNotification("Create Proposal", `Create Proposal Successful`, MESSAGE_TYPE.SUCCESS, () => { });

      getDaoDetail(daoFromDB._id);
      getDaoProposals(daoFromDB.address);
    }
  } catch (e) {
    openNotification("Create Proposal", e.message, MESSAGE_TYPE.ERROR, () => { })
  }
  store.dispatch(updateProcessStatus({
    actionName: actionNames.createProposal,
    att: processKeys.processing,
    value: false
  }))
}

export const getProposalDetail = async (dao_address: string | string[], id: number) => {
  try {


    const contract = await DaoContractAbi__factory.connect(dao_address.toString(), provider);
    // Need to get count member here


    let proposalReq = await fetch("/api/proposal/getByDAOAndId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dao_address: dao_address,
        id: id
      })
    })
    let proposalRes = await proposalReq.json();


    const { value } = await contract.functions.get_proposal_by_id(id).get();
    /**
     * {
    "id": "0x4",
    "owner": {
        "value": "0xf7f7a94f6873389dea29641a65fe6cd2124ccb9af6c8ae84200c44af77d2eebf"
    },
    "proposal_type": "0x1",
    "status": "0x1",
    "recipient": {
        "Address": {
            "value": "0x8e97044e93ed69d0268c3b022aa3385603d685a57ed2b6d88fae0dd0f6f41b84"
        }
    },
    "amount": "0x989680",
    "start_date": "0x4000000064bff99d",
    "end_date": "0x4000000064c14b1d",
    "created_date": "0x4000000064bffb3b",
    "allow_early_execution": true,
    "agree": "0x0",
    "disagree": "0x0",
    "executed": false
    }
     */
    let proposal = {
      created_date: new Date(TAI64.fromHexString(value.created_date.toHex()).toUnix() * 1000).toLocaleString(),
      agree: value.agree.toNumber(),
      disagree: value.disagree.toNumber(),
      executed: value.executed,
      status: value.status.toNumber(),
      allow_early_execution: value.allow_early_execution,
      amount: value.amount.toNumber() / 10 ** 9
    }
    store.dispatch(setProposalDetailProps({ proposalFromDB: proposalRes, proposalOnchain: proposal }));
  } catch (e) {
    console.log(e)
  }
}

export const vote = async (vote: boolean) => {
  try {
    const { account } = store.getState().account;
    const { proposalFromDB } = store.getState().proposal;
    if (!window.fuel || !account) {
      openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
      return;
    }

    let wallet = await window.fuel.getWallet(account);
    store.dispatch(updateProcessStatus({
      actionName: actionNames.vote,
      att: processKeys.processing,
      value: true
    }))

    const contract = await DaoContractAbi__factory.connect(proposalFromDB.dao_address, wallet);


    await contract.functions.vote(proposalFromDB.id, vote).txParams({ gasPrice: 1 }).call();

    openNotification("Vote", `Vote successful`, MESSAGE_TYPE.SUCCESS, () => { })
    //Reload Dao Proposals
    //   getDaoProposals(dao);
    // 

  } catch (e) {
    console.log(e);
    openNotification("Vote", e.message, MESSAGE_TYPE.ERROR, () => { })
  }

  store.dispatch(updateProcessStatus({
    actionName: actionNames.vote,
    att: processKeys.processing,
    value: false
  }))
}



// const updateProposalStatus = async (index: number, status: number) => {
//   let currentDaoAddress = store.getState().daoDetail.currentDaoAddress;
//   if (currentDaoAddress) {

//     console.log(tx.decodedResult);

//   }
// }


export const executeProposal = async () => {
  try {
    const { account } = store.getState().account;
    const { proposalFromDB } = store.getState().proposal;
    if (!window.fuel || !account) {
      openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
      return;
    }

    let wallet = await window.fuel.getWallet(account);

    const contract = await DaoContractAbi__factory.connect(proposalFromDB.dao_address, wallet);

    try {
      if (proposalFromDB.proposal_type == 1) {
        await contract.functions.execute_proposal(proposalFromDB.id)
          .txParams({ gasPrice: 1 })
          .call();
      } else {
        const fundToDaoContract = await DaoContractAbi__factory.connect(proposalFromDB.recipient, wallet);
        await contract.functions.execute_proposal(proposalFromDB.id)
          .addContracts([fundToDaoContract])
          .txParams({ gasPrice: 1 })
          .call();
      }
    } catch (e) {
      if (e.message !== 'Number can only safely store up to 53 bits') {
        throw e;
      }
    }

    store.dispatch(updateProcessStatus({
      actionName: actionNames.executeProposal,
      att: processKeys.processing,
      value: true
    }))


    fetch("/api/proposal/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: proposalFromDB._id,
        status: 2
      })
    })
    openNotification("Execute proposal", `Execute proposal successful`, MESSAGE_TYPE.SUCCESS, () => { })
    // updateStatistic("executedProposal", 1);
    // getDaoDetail(sharedDAOObj.id);
    // getDaoProposals(dao);
  } catch (e) {
    console.log(e);
    openNotification("Execute proposal", e.message, MESSAGE_TYPE.ERROR, () => { })
  }
  store.dispatch(updateProcessStatus({
    actionName: actionNames.executeProposal,
    att: processKeys.processing,
    value: false
  }))
}