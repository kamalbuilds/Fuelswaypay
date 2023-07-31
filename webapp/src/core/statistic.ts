import { setProps, setOwnerStatistic } from "src/controller/dao/statisticSlice";
import { store } from "src/controller/store";
import {countDAOProposalStreamChannel, getGeneralStatistic, getPayoutStatistic } from "./common";

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

export const getCountOwnerContracts =async (account: string) => {
    if (account) {
        let counts = await countDAOProposalStreamChannel(account);
        console.log(counts);
        store.dispatch(setOwnerStatistic(counts))
    }
  
}