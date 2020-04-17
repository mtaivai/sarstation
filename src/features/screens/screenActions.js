import yaml from 'js-yaml';

import { createAsyncThunk } from '@reduxjs/toolkit'

let nextId = 1;


/**
 *
 * @param {ScreenDescriptor} screen
 */
function addUniqueComponentIdsToScreen(screen) {
    addUniqueComponentId(screen.content);
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
            return dispatch(fetchScreenById(screenId))
        }
    }
}

export const fetchScreenById = createAsyncThunk(
    'screens/fetchByIdStatus',
    (screenId, thunkAPI) => {

        const url = "http://localhost:3001/screens/" + screenId;

        console.log("Data to fetch:", screenId, url);
        return fetch(url)
            .then(response => response.text())
            .then((text) => yaml.load(text))
            .then(checkScreenDescriptorStructure)
            .then(addUniqueComponentIdsToScreen);
    }
)

