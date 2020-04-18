//import React from "react";

import {createComponentByType} from "./Component.js";
import {useDrag} from "react-dnd";
import React from "react";
import ComponentWrapper from "./ComponentWrapper";
import "./Container.scss"
import {firstNonNull, orElseGet, resolveIndirect} from "../util";


// getChildProperties
//   A function returning an object. Function gets default properties as its first parameter.
//
// createChildElement (childProperties)
//   Create a child element (React component) from properties
// childElementCreated(childElement, childProperties)
//
// createOuterChildComponent (childElement, childProperties)
//   Create contained component (wrapper) for the child with container constraints
//
// dragHover
// dragCanDrop
/**
 *
 * @param props
 * @param handlers
 * @returns a list of objects [{element:..., properties:{...}}]
 */
export function createChildren(props, handlers) {

    if (typeof handlers === "function") {
        handlers = handlers();
    }
    if (handlers === null || typeof handlers === "undefined") {
        handlers = {};
    }
    const children = [];

    let { components, getTemplateData, id: zoneId, screenId } = props;

    components = orElseGet(components, () => []);

    const templateData = (getTemplateData !== null && typeof getTemplateData === "function") ? getTemplateData() : null;

    let childIndex = 0;

    const allChildren = [];
    // Add direct (i.e. explicit) children first
    for (const comp of components) {
        const componentId = comp["@id"];
        allChildren.push({childIndex, componentId, props: comp});
        childIndex++;
    }
    // Then those from the layout:
    // (If we are a template / layout and there are ready created components to be populated,
    //  populate them now)
    if (zoneId && templateData && templateData.zoneComponents) {
        const componentsInZone = templateData.zoneComponents[zoneId];
        if (componentsInZone !== null && typeof componentsInZone !== "undefined") {
            for (const c of componentsInZone) {
                const props = {...c}
                const componentId = props["@id"];
                allChildren.push({childIndex, componentId, props});
                childIndex++;
            }
        }
    }

    let createChildElement = handlers["createChildElement"];
    if (createChildElement === null || typeof createChildElement === "undefined") {
        createChildElement = createComponentByType;
    }
    const getChildProperties = handlers["getChildProperties"];
    const createOuterChildComponent = handlers["createOuterChildComponent"];

    for (const child of allChildren) {

        const {props, componentId, childIndex} = child;

        const childKey = firstNonNull(props.key, componentId, childIndex);

        let childProps = {...props, componentId, childIndex, screenId, key: childKey};

        if (templateData !== null && typeof templateData !== "undefined") {
            // Pass the "templateData" to children:
            childProps.getTemplateData = getTemplateData;
        }

        if (getChildProperties !== null && typeof getChildProperties === "function") {
            childProps = getChildProperties(childProps);
        }

        let wrapperElement = <ComponentWrapper
            key={childKey}
            createChildElement={createChildElement}
            childElementCreated={handlers.childElementCreated}
            dragHover={handlers.dragHover}
            dragCanDrop={handlers.dragCanDrop}
            childIndex={childIndex}
            componentId={componentId}
            componentProps={childProps}
            screenId={screenId} />;

        if (createOuterChildComponent !== null && typeof createOuterChildComponent === "function") {
            wrapperElement = createOuterChildComponent(wrapperElement, childProps);
        }

        children.push({element: wrapperElement, properties: childProps});
    }

    const collect = handlers["collect"];
    if (collect !== null && typeof collect !== "undefined") {
        const collected = [];
        for (const child of children) {
            const result = collect(child);
            if (result !== null && typeof result !== "undefined") {
                collected.push(result);
            }
        }
        return collected;
    } else {
        return children;
    }

}



