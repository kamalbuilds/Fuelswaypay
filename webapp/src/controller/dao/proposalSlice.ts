import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProposalState = {
    proposalFromDB: {
        allow_early_execution: boolean,
        amount: number,
        content: string,
        content_type: number,
        created_at: string,
        dao_address: string,
        end_date: number,
        id: number,
        owner: string,
        proposal_type: 1,
        recipient: string,
        start_date: number,
        title: string,
        _id: string,
        status?: number
    },
    proposalOnchain: {
        created_date: string
        agree: number,
        disagree: number,
        executed: boolean,
        status: number,
        allow_early_execution: boolean,
        amount: number
    }
}

const initialState: ProposalState = {
    proposalFromDB: {
        allow_early_execution: true,
        amount: 0,
        content: "0",
        content_type: 1,
        created_at: "",
        dao_address: "",
        end_date: new Date().getTime(),
        id: 0,
        owner: "",
        proposal_type: 1,
        recipient: "",
        start_date: new Date().getTime(),
        title: "",
        _id: "",
        status: 0
    },
    proposalOnchain: {
        created_date: "",
        agree: 0,
        disagree: 0,
        executed: false,
        status: 0,
        allow_early_execution: false,
        amount: 0
    }
}

export const proposalDetailSlice = createSlice({
    name: 'daoDetail',
    initialState: initialState,
    reducers: {
        setProposalDetailProps: (state: ProposalState, action: PayloadAction<{ proposalFromDB: any, proposalOnchain: any }>) => {
            state.proposalFromDB = action.payload.proposalFromDB;
            state.proposalOnchain = action.payload.proposalOnchain;
        }
    }
})
export const { setProposalDetailProps } = proposalDetailSlice.actions;
export default proposalDetailSlice.reducer;