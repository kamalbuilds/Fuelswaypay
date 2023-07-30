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

}

export const statisticSlice = createSlice({
    name: 'statistic',
    initialState: initialState,
    reducers: {
        setProps: (state: StatisticState, action: PayloadAction<{ generalStatistic: any, payoutStatistic: any }>) => {
            state.generalStatistic = action.payload.generalStatistic;
            state.payoutStatistic = action.payload.payoutStatistic;
        }
    }
})
export const { setProps } = statisticSlice.actions;
export default statisticSlice.reducer;