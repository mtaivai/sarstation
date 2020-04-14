
import yaml from 'js-yaml';
import data from './test.yaml';

// Returns Promise
export function loadScreen() {

    return fetch(data)
        .then((r) => r.text())
        .then((text) => yaml.load(text))
        .then(addUniqueIds);

}

function addUniqueIds(screen) {
    addUniqueIdToComponent(screen.content);
    return screen;
}

let nextId = 1;
function addUniqueIdToComponent(component) {
    if (component === null || typeof component === "undefined") {
        return;
    }
    component["@id"] = nextId++;
    const children = component["components"];
    if (children !== null && typeof children !== "undefined") {
        for (const child of children) {
            addUniqueIdToComponent(child.component);
        }
    }
    return component;
}

export function setDraggedItem(componentId) {

}
