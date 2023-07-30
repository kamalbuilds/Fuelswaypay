import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CreateStreamState = {
    status: number
}

const initialState: CreateStreamState = {
    status: 0,
}

export const createStreamSlice = createSlice({
    name: 'createStream',
    initialState: initialState,
    reducers: {
        setCreateStreamProps: (state: CreateStreamState, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        }
    }
})
export const { setCreateStreamProps } = createStreamSlice.actions;
export default createStreamSlice.reducer;