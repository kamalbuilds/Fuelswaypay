import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DaoFormState = {
    _id?: string,
    title: string,
    description: string,
    quorum: number,
    open: boolean,
    dao_type: number,
    twitter?: string,
    github?: string,
    slack?: string, 
    members: {address: string}[],
    step: number,
    voting_mode: number,
    status?: number,
    address?: string
}


const initialState: DaoFormState = {
    _id: "",
    title: "",
    description: "",
    quorum: 100,
    open: false,
    dao_type: 1,
    members: [],
    step: 0,
    voting_mode: 1,
}

export const daoFormSlice = createSlice({
    name: 'daoForm',
    initialState: initialState,
    reducers: {
        setDaoFormProps: (state: DaoFormState, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        },
        updateDaoFormState: (state: DaoFormState, action: PayloadAction<any>) => {
            state._id = action.payload._id;
            state.status = action.payload.status;
            state.address = action.payload.address;
        }
    }
})
export const { setDaoFormProps, updateDaoFormState } = daoFormSlice.actions;
export default daoFormSlice.reducer;