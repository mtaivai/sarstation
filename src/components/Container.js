//import React from "react";

import {createComponentByType} from "./Component.js";
import {useDrag} from "react-dnd";
import React from "react";
import DraggableComponentWrapper from "./DraggableComponentWrapper";
import "./Container.css"

const defaultCreateChildElement = createComponentByType;

// getChildProperties
//   A function returning an object. Function gets default properties as its first parameter.
//
// createChildElement (childProperties)
//   Create a child element (React component) from properties
// childElementCreated(childElement, childProperties)
//
// createOuterChildComponent (childElement, childProperties, constraints)
//   Create contained component (wrapper) for the child with container constraints
//
// dragHover
// dragCanDrop
export function createChildren(props, handlers) {

    if (typeof handlers === "function") {
        handlers = handlers();
    }
    if (handlers === null || typeof handlers === "undefined") {
        handlers = {};
    }
    const children = [];
    if (typeof(props["components"]) !== "undefined" && props["components"] !== null) {

        const getChildProperties = handlers["getChildProperties"];

        let createChildElement = handlers["createChildElement"];
        if (createChildElement === null || typeof createChildElement === "undefined") {
            createChildElement = defaultCreateChildElement;
        }
        const childElementCreated = handlers["childElementCreated"];
        const createOuterChildComponent = handlers["createOuterChildComponent"];


        let childIndex = 0;
        for (const containedComponent of props["components"]) {
            const comp = containedComponent.component;
            const constraints = containedComponent.constraints;
            const componentId = comp["@id"];
            const childKey = childIndex;

            let childProps = {...comp, componentId, childIndex, key: childKey};
            if (getChildProperties !== null && typeof getChildProperties === "function") {
                childProps = getChildProperties(childProps, constraints);
            }
            let elem = createChildElement(childProps, constraints);
            if (childElementCreated !== null && typeof childElementCreated !== "undefined") {
                childElementCreated(elem, childProps, constraints);
            }

            elem = (<DraggableComponentWrapper
                key={childKey}
                dragHover={handlers.dragHover}
                dragCanDrop={handlers.dragCanDrop}
                componentId={componentId}
                childIndex={childIndex}>
                {elem}
            </DraggableComponentWrapper>);

            if (createOuterChildComponent !== null && typeof createOuterChildComponent === "function") {
                elem = createOuterChildComponent(elem, childProps, constraints);
            }

            children.push(elem);
            childIndex++;
        }
    }
    return children;

}



