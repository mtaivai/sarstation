import { REQUEST_SCREEN } from "./actionTypes";
import { RECEIVE_SCREEN } from "./actionTypes";

import yaml from 'js-yaml';
import data from '../test.yaml';


export function requestScreen (content) {
    return {
        type: REQUEST_SCREEN,
        payload: {}
    }
}

export function receiveScreen (content) {
    return {
        type: RECEIVE_SCREEN,
        screen: content
    }
}

function fetchScreen() {
    return dispatch => {
        dispatch(requestScreen())
        return fetch(data)
            .then(response => response.text())
            .then((text) => yaml.load(text))
            .then(addUniqueComponentIdsToScreen)
            .then(screen => dispatch(receiveScreen(screen)))
    }
}

let nextId = 1;
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
            addUniqueComponentId(child.component);
        }
    }
    return component;
}


function shouldFetchScreen(state) {
    console.log("shouldFetch", state);
    if (state.screens.screen) {
        return false;
    } else {
        return !state.screens.fetching;
    }
}

export function fetchScreenIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchScreen(getState())) {
            return dispatch(fetchScreen())
        }
    }
}

