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
import moment from "moment";


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

    let { account } = store.getState().account;
    if (!account) {
      if (window.fuel) {
        const isConnected = await window.fuel.isConnected();
        if (isConnected) {
          const [acc] = await window.fuel.accounts();
          account = acc;
        }
      }
    }

    const contract = await DaoContractAbi__factory.connect(dao_address.toString(), provider);
    // Need to get count member here

    const [proposalReq, proposalInfo, daoInfo, daoReq] = await Promise.all([
      fetch("/api/proposal/getByDAOAndId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dao_address: dao_address,
          id: id
        })
      }),
      contract.functions.get_proposal_by_id(id).get(),
      contract.functions.get_dao_info().get(),
      fetch("/api/dao/getByAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: dao_address
        })
      })

    ]);
    let voted = false;
    let isMember = false;
    if (account) {
      let [userVoteOnchain, isMemberOnchain] = await Promise.all([
        contract.functions.get_user_vote({ value: Address.fromString(account).toB256() }, id).get(),
        contract.functions.is_member({ value: Address.fromString(account).toB256() }).get(),
      ])
      voted = userVoteOnchain.value;
      isMember = isMemberOnchain.value;
    }

    let proposalRes = await proposalReq.json();
    const proposal = proposalInfo.value;
    const dao = daoInfo.value;
    const daoRes = await daoReq.json();

    let daoOnchain = {
      quorum: dao[0].quorum.toNumber(),
      open: dao[0].open,
      dao_type: dao[0].dao_type.toNumber(),
      owner: Address.fromAddressOrString(dao[1].value).toString(),
      status: dao[2].toNumber(),
      count_proposal: dao[3].toNumber(),
      count_member: dao[4].toNumber(),
      balance: dao[5].toNumber() / 10 ** 9,
      created_date: new Date(TAI64.fromHexString(dao[6].toHex()).toUnix() * 1000).toLocaleString()
    };

    let proposalOnchain = {
      created_date: new Date(TAI64.fromHexString(proposal.created_date.toHex()).toUnix() * 1000).toLocaleString(),
      agree: proposal.agree.toNumber(),
      disagree: proposal.disagree.toNumber(),
      executed: proposal.executed,
      status: proposal.status.toNumber(),
      allow_early_execution: proposal.allow_early_execution,
      amount: proposal.amount.toNumber() / 10 ** 9
    }

    store.dispatch(setProposalDetailProps({
      proposalFromDB: proposalRes,
      proposalOnchain: proposalOnchain,
      daoOnchain: daoOnchain,
      daoFromDB: daoRes,
      voted: voted,
      isMember: isMember
    }));
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
    getProposalDetail(proposalFromDB.dao_address, proposalFromDB.id);

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

    store.dispatch(updateProcessStatus({
      actionName: actionNames.executeProposal,
      att: processKeys.processing,
      value: true
    }))

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

    updateStatistic("executedProposal", 1);
    getProposalDetail(proposalFromDB.dao_address, proposalFromDB.id);

    openNotification("Execute proposal", `Execute proposal successful`, MESSAGE_TYPE.SUCCESS, () => { })

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