import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StatisticState = {
    generalStatistic: {
        dao: number,
        fund: number,
        proposal: number,
        executed_proposal: number,
        members: number
    },
    payoutStatistic: {
        totalPayout: any[],
        totalPayoutByDate: any[]
    },
    countDAOs: number,
    countProposals: number,
    countStreams: number,
    countChannels: number
}
const initialState: StatisticState = {
    generalStatistic: {
        dao: 0,
        fund: 0,
        proposal: 0,
        executed_proposal: 0,
        members: 0
    },
    payoutStatistic: {
        totalPayout: [],
        totalPayoutByDate: []
    },
    countDAOs: 0,
    countProposals: 0,
    countStreams: 0,
    countChannels: 0,
    

}

export const statisticSlice = createSlice({
    name: 'statistic',
    initialState: initialState,
    reducers: {
        setProps: (state: StatisticState, action: PayloadAction<{ generalStatistic: any, payoutStatistic: any }>) => {
            state.generalStatistic = action.payload.generalStatistic;
            state.payoutStatistic = action.payload.payoutStatistic;
        },
        setOwnerStatistic: (state: StatisticState, action: PayloadAction<{ countDAOs: number, countProposals: number, countStreams: number, countChannels: number }>) => {
            state.countDAOs = action.payload.countDAOs;
            state.countProposals = action.payload.countProposals;
            state.countStreams = action.payload.countStreams;
            state.countChannels = action.payload.countChannels;
        },
    }
})
export const { setProps, setOwnerStatistic } = statisticSlice.actions;
export default statisticSlice.reducer;