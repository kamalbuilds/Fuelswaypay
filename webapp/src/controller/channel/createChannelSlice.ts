import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CreateChannelState = {
    status: number
}

const initialState: CreateChannelState = {
    status: 0,
}

export const createChannelSlice = createSlice({
    name: 'channel',
    initialState: initialState,
    reducers: {
        setCreateChannelProps: (state: CreateChannelState, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        }
    }
})
export const { setCreateChannelProps } = createChannelSlice.actions;
export default createChannelSlice.reducer;