import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist';
import accountReducer from "./account/accountSlice";
import daoReducer from "./dao/daoSlice";
import daoDetailReducer from "./dao/daoDetailSlice";
import daoFormReducer from "./dao/daoFormSlice";
import processReducer from "./process/processSlice";
import statisticReducer from "./dao/statisticSlice";
import streamReducer from "./stream/streamSlice";
import channelReducer from "./channel/channelSlice";
import proposalReducer from "./dao/proposalSlice";
import createStreamReducer from "./stream/createStreamSlice";
import createChannelReducer from "./channel/createChannelSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            account: accountReducer,
            dao: daoReducer,
            process: processReducer,
            daoDetail: daoDetailReducer,
            daoForm: daoFormReducer,
            statistic: statisticReducer,
            stream: streamReducer,
            channel: channelReducer,
            proposal: proposalReducer,
            createStream: createStreamReducer,
            createChannel: createChannelReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    })
}

export const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
    >

export const persistor  = persistStore(store)    