import {createSlice} from "@reduxjs/toolkit";
import {fetchScreenById} from "./screenActions";


const screensSlice = createSlice({
    name: 'screens',
    initialState: {
        // Entities is M(id -> screen) and contains both, layouts and entities. Id's are prefixed
        // with 's/' for screen and with 'l/' for layout!
        entities: {},
        error: null
    },
    reducers: {},
    extraReducers: {
        [fetchScreenById.pending]: (state, action) => {
            const { arg:screenId } = action.meta
            const entity = state.entities[screenId];
            if (!entity || !entity.loading || entity.loading === "idle") {
                state.entities[screenId] = {
                    ...entity,
                    loading: "pending",
                    currentRequestId: action.meta.requestId
                }

            }
        },
        [fetchScreenById.fulfilled]: (state, action) => {
            const { requestId, arg:screenId } = action.meta
            const entity = state.entities[screenId];

            if (entity && entity.loading === 'pending' && entity.currentRequestId === requestId) {
                entity.loading = 'idle'
                entity.screen = action.payload
                entity.currentRequestId = undefined
            }
        },
        [fetchScreenById.rejected]: (state, action) => {
            const { requestId, arg:screenId } = action.meta

            const entity = state.entities[screenId];

            if (entity && entity.loading === 'pending' && entity.currentRequestId === requestId) {
                entity.loading = 'idle'
                entity.error = action.error
                entity.currentRequestId = undefined
            }
        }
    }
})

const {actions, reducer} = screensSlice;

export default reducer;