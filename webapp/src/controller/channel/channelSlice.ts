import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Channel = {
    _id?: string,
    title: string,
    payer: `fuel${string}`,
    payee: `fuel${string}`,
    total_fund: number,
    created_at: number,
    status: number,
    address?: string,
    withdrew: number,
    nonce: number,
}

export type Claim = {
    _id?: string,
    payer: `fuel${string}`,
    payee: `fuel${string}`,
    nonce: number,
    channel_address: string,
    title: string,
    meta_url: string,
    amount: number,
    status: number,
    signature: string,
    created_at: string,
    hash: string
}


type ChannelState = {

    incomingChannels: Channel[],
    outgoingChannels: Channel[],
    currentClaims: Claim[],
}

const initialState: ChannelState = {
    incomingChannels: [],
    outgoingChannels: [],
    currentClaims: [],
}

export const channelSlice = createSlice({
    name: 'channel',
    initialState: initialState,
    reducers: {
        setChannelProps: (state: ChannelState, action: PayloadAction<{ att: string, value: any }>) => {
            state[action.payload.att] = action.payload.value
        }
    }
})
export const { setChannelProps } = channelSlice.actions;
export default channelSlice.reducer;