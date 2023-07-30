import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DAO } from './daoSlice';

type DaoState = {
    daoFromDB: any,
    daoOnchain: {
        quorum: number,
        open: boolean,
        dao_type: number,
        owner: string,
        status: number,
        count_proposal: number,
        count_member: number,
        balance: number,
        created_date: string
    },
    proposals: any[],
    members: string[],
    treasury: {address: string, amount: number}[]
}

const initialState: DaoState = {
    daoFromDB: {
        title: "",
        description: "",
        address: ""
    },
    daoOnchain:  {
        quorum: 0,
        open: false,
        dao_type: 1,
        owner: "",
        status: 1,
        count_proposal: 0,
        count_member: 0,
        balance: 0,
        created_date: "" 
    },
    proposals: [],
    members: [],
    treasury:[]
}

export const daoDetailSlice = createSlice({
    name: 'daoDetail',
    initialState: initialState,
    reducers: {
        setDaoDetailProps: (state: DaoState, action: PayloadAction<{ daoFromDB: any, daoOnChain: any }>) => {
            state.daoFromDB = action.payload.daoFromDB;
            state.daoOnchain = action.payload.daoOnChain;
        },
        setProposals: (state: DaoState, action: PayloadAction<any>) => {
            state.proposals = action.payload
        },
        setMembers: (state: DaoState, action: PayloadAction<string[]>) => {
            state.members = action.payload
        },
        setTreasury: (state: DaoState, action: PayloadAction<{address: string, amount: number}[]>) => {
            state.treasury = action.payload
        }
    }
})
export const { setDaoDetailProps, setProposals, setMembers, setTreasury } = daoDetailSlice.actions;
export default daoDetailSlice.reducer;