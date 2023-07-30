import { setDAOStatistic } from "../controller/dao/daoSlice";
import { setProps } from "../controller/dao/statisticSlice";
import { store } from "../controller/store";
import {getGeneralStatistic, getPayoutStatistic } from "./common";

export const getStatistic = async () => {
    const [generalStatistic, payoutStatistic] = await Promise.all([
        getGeneralStatistic(),
        getPayoutStatistic()
    ]);
    console.log(generalStatistic, payoutStatistic);
    if (generalStatistic && payoutStatistic) {
        store.dispatch(setProps({ generalStatistic: generalStatistic, payoutStatistic: payoutStatistic }))
    }

}

export const getCountDAOAndProposal =async (wallet: any) => {
    if (wallet.connected) {
        // let counts = await countDAOandProposalsFromDB(wallet);
        // console.log(counts);
        // let countDAO = 0;
        // let countProposal = 0;
        // if (counts.length > 0) {
        //     let daoFilters = counts.filter(c => c._id === "DAO");
        //     if (daoFilters.length > 0) {
        //         countDAO = daoFilters[0].count;
        //     }

        //     let proposalFilters = counts.filter(c => c._id === "Proposal");
        //     if (proposalFilters.length > 0) {
        //         countProposal = proposalFilters[0].count;
        //     }
        // }

        // store.dispatch(setDAOStatistic({ countOwnerDaos: countDAO, countOwnerProposal: countProposal }))
    }
  
}