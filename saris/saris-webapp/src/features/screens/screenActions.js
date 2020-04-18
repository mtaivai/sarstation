import yaml from 'js-yaml';

import { createAsyncThunk } from '@reduxjs/toolkit'
import {orElse} from "../../util";

let nextId = 1;


/**
 *
 * @param {ScreenDescriptor} screen
 */
function addUniqueComponentIdsToScreen(screen) {
    if (Array.isArray(screen.components)) {
        for (const component of screen.components) {
            addUniqueComponentId(component);
        }
    } else {
        addUniqueComponentId(screen.components);
    }
    return screen;
}

function addUniqueComponentId(component) {
    if (component === null || typeof component === "undefined") {
        return;
    }
    component["@id"] = nextId++;
    const children = component["components"];
    if (children !== null && typeof children !== "undefined") {
        for (const child of children) {
            addUniqueComponentId(child);
        }
    }
    return component;
}


/**
 *
 * @param screen
 * @return {ScreenDescriptor}
 */
function checkScreenDescriptorStructure(screen) {

    // TODO implement me
    if (screen.syntax !== null && typeof screen.syntax !== "undefined") {
        // Must be of format "vssd major.minor.patch"

    }

    return screen;
}

function shouldFetchScreen(state, screenId) {
    const screenEntity = state.screens.entities[screenId];
    const screen = screenEntity ? screenEntity.screen : undefined;
    return (!screen && (!screenEntity || screenEntity.loading === "idle"));
}

/**
 *
 * @param {string} screenId
 * @returns {function(...[*]=)}
 */
export function fetchScreenIfNeeded(screenId) {
    return (dispatch, getState) => {
        if (shouldFetchScreen(getState(), screenId)) {
            return dispatch(fetchScreenByIdThunk(screenId))
        }
    }
}

export function updateScreenComponent(screenId, componentId, componentData) {
    // TODO do not allow modification of @id, type, componentId, screenId, okay?
    return (dispatch, getState) => {
        return dispatch(updateScreenComponentThunk({screenId, componentId, data: componentData}))
    }
}


export const fetchScreenByIdThunk = createAsyncThunk(
    'screens/fetchByIdStatus',
    (screenId, thunkAPI) => {

        const url = "http://localhost:3001/screens/" + screenId;

        console.log("Data to fetch:", screenId, url);
        return fetch(url)
            .then(response => response.text())
            .then((text) => yaml.load(text))
            .then(checkScreenDescriptorStructure)
            .then(addUniqueComponentIdsToScreen)
    }
)


export const updateScreenComponentThunk = createAsyncThunk(
    'screens/updateScreenComponentStatus',
    (args, thunkAPI) => {

        const {componentId, screenId, data} = args;

        const state = thunkAPI.getState();

        // console.log("UPDATE (s, c, data, state)", screenId, componentId, data, state);

        const screen = state.screens.entities[screenId].screen;

        // console.log("UPDATE2 (s)", screen);

        const component = findComponentHavingId(componentId, screen);

        // console.log("UPDATE3 (c)", component);

        const newComponent = {...component};

        for (const n in newComponent) {
            if (!newComponent.hasOwnProperty(n)) {
                continue;
            }
            if (typeof data[n] !== "undefined") {
                newComponent[n] = data[n];
            }
        }
        console.log("AFTER (s, c, data, state)", screenId, componentId, newComponent);

        return newComponent;

        // const url = "http://localhost:3001/screens/" + screenId;
        //
        // console.log("Data to fetch:", screenId, url);
        // return fetch(url)
        //     .then(response => response.text())
        //     .then((text) => yaml.load(text))
        //     .then(checkScreenDescriptorStructure)
        //     .then(addUniqueComponentIdsToScreen)
    }
)



export function findComponentHavingId(id, root, collector) {
    // console.log("findComponentHavingId", id, root)
    if (root.hasOwnProperty("@id") && root["@id"] === id) {
        // console.log("findComponentHavingId found ", id, root)
        if (collector !== null && typeof collector !== "undefined") {
            // console.log("kalling conl found ", id, root)
            return collector(root);
        } else {
            return root;
        }
    } else {
        let children = root.components;
        if (children === null || typeof children === "undefined") {
            return null;
        } else if (!Array.isArray(children)) {
            children = [children];
        }
        for (const child of children) {
            const r = findComponentHavingId(id, child, collector);
            if (r !== null && typeof r !== "undefined") {
                return r;
            }
        }
        return null;
    }

}
