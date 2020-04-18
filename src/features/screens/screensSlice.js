import {createSlice} from "@reduxjs/toolkit";
import {fetchScreenByIdThunk, findComponentHavingId, updateScreenComponentThunk} from "./screenActions";
import {orElse} from "../../util";


const screensSlice = createSlice({
    name: 'screens',
    initialState: {
        // Entities is M(id -> screen) and contains both, layouts and entities. Id's are prefixed
        // with 's/' for screen and with 'l/' for layout!
        entities: {},
        error: null
    },
    reducers: {
        // updateScreenComponent(state, action) {
        //     const {screenId, componentId} = action.meta.arg;
        //
        //     const component = findComponentHavingId(
        //         componentId, state.entities[screenId].screen, (s) => s.content);
        //     //delete state.entities[screenId].screen;
        //     component.
        // }
    },
    extraReducers: {
        [fetchScreenByIdThunk.pending]: (state, action) => {
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
        [fetchScreenByIdThunk.fulfilled]: (state, action) => {
            const { requestId, arg:screenId } = action.meta
            const entity = state.entities[screenId];

            if (entity && entity.loading === 'pending' && entity.currentRequestId === requestId) {
                entity.loading = 'idle'
                entity.screen = action.payload
                // entity.templateData = mapTemplateData(orElse(entity.screen, {}).content)
                entity.currentRequestId = undefined
            }
        },
        [fetchScreenByIdThunk.rejected]: (state, action) => {
            const { requestId, arg:screenId } = action.meta

            const entity = state.entities[screenId];

            if (entity && entity.loading === 'pending' && entity.currentRequestId === requestId) {
                entity.loading = 'idle'
                entity.error = action.error
                entity.currentRequestId = undefined
            }
        },
        [updateScreenComponentThunk.pending]: (state, action) => {
            // TODO
            // const {screenId, componentId} = action.meta.arg;
            // const entity = state.entities[screenId];
            // if (!entity || !entity.loading || entity.loading === "idle") {
            //     state.entities[screenId] = {
            //         ...entity,
            //         loading: "pending",
            //         currentRequestId: action.meta.requestId
            //     }
            //
            // }
            console.log("Pending", state, action);
        },
        [updateScreenComponentThunk.fulfilled]: (state, action) => {
            console.log("updateScreenComponentThunk.fulfilled", state, action)
            const { screenId, componentId } = action.meta.arg
            const componentData = action.payload

            console.log("updateScreenComponentThunk.fulfilled payload", componentData)
            const entity = state.entities[screenId];

            console.log("updateScreenComponentThunk.fulfilled entity", entity)

            if (entity && componentData) {

                console.log("has entity and componentData");
                console.log("screen", entity.screen);
                //entity.loading = 'idle'
                //delete entity.screen
                // entity.templateData = mapTemplateData(orElse(entity.screen, {}).content)
                //delete entity.currentRequestId

                //entity.screen = action.payload
                findComponentHavingId(componentId, entity.screen, (c) => {

                    console.log("FOUND", c);

                    for (const p in c) {
                        if (!c.hasOwnProperty(p)) {
                            continue;
                        }
                        c[p] = componentData[p];
                    }
                    console.log("AFTER", c.content, componentData.content);
                    return c;

                })

            }
        },
        [updateScreenComponentThunk.rejected]: (state, action) => {
            console.warn("Rejected", state, action);
            // TODO
            // const { requestId, arg:screenId } = action.meta
            //
            // const entity = state.entities[screenId];
            //
            // if (entity && entity.loading === 'pending' && entity.currentRequestId === requestId) {
            //     entity.loading = 'idle'
            //     entity.error = action.error
            //     entity.currentRequestId = undefined
            // }
        }
    }
})



//
// function mapTemplateData(content) {
//     // Layout already loaded. Now collect components to be inserted from the screen
//     // instance for later instantiation in the corresponding container:
//
//     const templateData = { zoneComponents: {} };
//
//     // zoneComponents
//     // zoneId: [{component descriptor}, ...]
//     const contentArray = Array.isArray(content) ? content : [content];
//     for (const comp of contentArray) {
//         const zone = orElse(comp.container, "").trim();
//         if (zone !== null && typeof zone !== "undefined") {
//             let componentList = templateData.zoneComponents[zone];
//             if (componentList === null || typeof componentList === "undefined") {
//                 templateData.zoneComponents[zone] = componentList = [];
//             }
//             componentList.push(comp);
//         }
//     }
//     return templateData;
// }

const {actions, reducer} = screensSlice;

export default reducer;