import {createSlice} from "@reduxjs/toolkit";
import {fetchScreenById} from "./screenActions";


const screensSlice = createSlice({
    name: 'screens',
    initialState: {
        screen: null,
        loading: 'idle',
        currentRequestId: undefined,
        error: null
    },
    reducers: {},
    extraReducers: {
        [fetchScreenById.pending]: (state, action) => {
            if (state.loading === 'idle') {
                state.loading = 'pending'
                state.currentRequestId = action.meta.requestId
            }
        },
        [fetchScreenById.fulfilled]: (state, action) => {
            const { requestId } = action.meta
            if (state.loading === 'pending' && state.currentRequestId === requestId) {
                state.loading = 'idle'
                state.screen = action.payload
                state.currentRequestId = undefined
            }
        },
        [fetchScreenById.rejected]: (state, action) => {
            const { requestId } = action.meta
            if (state.loading === 'pending' && state.currentRequestId === requestId) {
                state.loading = 'idle'
                state.error = action.error
                state.currentRequestId = undefined
            }
        }
    }
})

const {actions, reducer} = screensSlice;

export default reducer;