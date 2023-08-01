import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type ProposalFromDB = {
    allow_early_execution: boolean,
    amount: number,
    content: string,
    content_type: number,
    created_at: string,
    dao_address: string,
    end_date: number,
    id: number,
    owner: string,
    proposal_type: number,
    recipient: string,
    start_date: number,
    title: string,
    _id: string,
    status?: number,
    external_url?: string
};

type ProposalState = {
    proposalFromDB: ProposalFromDB,
    proposalOnchain: {
        created_date: string
        agree: number,
        disagree: number,
        executed: boolean,
        status: number,
        allow_early_execution: boolean,
        amount: number
    },
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
    daoFromDB: any,
    voted: any,
    isMember: boolean,
    myProposals: ProposalFromDB[]
}

const initialState: ProposalState = {
    proposalFromDB: {
        allow_early_execution: true,
        amount: 0,
        content: "",
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
        status: 0,
        external_url: ""
    },
    proposalOnchain: {
        created_date: "",
        agree: 0,
        disagree: 0,
        executed: false,
        status: 0,
        allow_early_execution: false,
        amount: 0
    },
    daoOnchain: {
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
    daoFromDB: {
        title: "",
        description: "",
        address: ""
    },
    voted: false,
    isMember: false,
    myProposals: []
}

export const proposalDetailSlice = createSlice({
    name: 'proposal',
    initialState: initialState,
    reducers: {
        setProposalDetailProps: (state: ProposalState, action: PayloadAction<{
            proposalFromDB: any,
            proposalOnchain: any,
            daoOnchain: any,
            daoFromDB: any,
            voted: any,
            isMember: boolean
        }>) => {
            state.proposalFromDB = action.payload.proposalFromDB;
            state.proposalOnchain = action.payload.proposalOnchain;
            state.daoOnchain = action.payload.daoOnchain;
            state.daoFromDB = action.payload.daoFromDB;
            state.voted = action.payload.voted;
            state.isMember = action.payload.isMember;
        },
        setMyProposals: (state: ProposalState, action: PayloadAction<ProposalFromDB[]>) => {
            state.myProposals = action.payload;
        }
    }
})
export const { setProposalDetailProps, setMyProposals } = proposalDetailSlice.actions;
export default proposalDetailSlice.reducer;