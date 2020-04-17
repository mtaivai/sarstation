//import React from "react";

import {createComponentByType} from "./Component.js";
import {useDrag} from "react-dnd";
import React from "react";
import ComponentWrapper from "./ComponentWrapper";
import "./Container.scss"
import {firstNonNull, orElseGet} from "../util";

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
/**
 *
 * @param props
 * @param handlers
 * @returns {[]}
 */
export function createChildren(props, handlers) {

    if (typeof handlers === "function") {
        handlers = handlers();
    }
    if (handlers === null || typeof handlers === "undefined") {
        handlers = {};
    }
    const children = [];

    let { components, templateData, id: zoneId } = props;

    components = orElseGet(components, () => []);

    const getChildProperties = handlers["getChildProperties"];

    let createChildElement = handlers["createChildElement"];
    if (createChildElement === null || typeof createChildElement === "undefined") {
        createChildElement = defaultCreateChildElement;
    }
    const childElementCreated = handlers["childElementCreated"];
    const createOuterChildComponent = handlers["createOuterChildComponent"];


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

                const {props, component} = c;
                const componentId = props["@id"];
                allChildren.push({childIndex, componentId, props, component});

                childIndex++;
            }
        }
    }

    for (const child of allChildren) {

        const {props, componentId, childIndex} = child;

        const constraints = props.layoutConstraints;

        const childKey = firstNonNull(props.key, componentId, childIndex);

        let childProps = {...props, componentId, childIndex, key: childKey};

        if (templateData !== null && typeof templateData !== "undefined") {
            // Pass the "templateData" to children:
            childProps.templateData = templateData;
        }

        if (getChildProperties !== null && typeof getChildProperties === "function") {
            childProps = getChildProperties(childProps, constraints);
        }

        let elem = child.component;
        if (elem === null || typeof elem === "undefined") {
            // TODO add editor site
            console.warn("TODO add editor site like in Screen");
            elem = createChildElement(childProps, constraints);
            if (childElementCreated !== null && typeof childElementCreated !== "undefined") {
                childElementCreated(elem, childProps, constraints);
            }
        }

        elem = (<ComponentWrapper
            key={childKey}
            dragHover={handlers.dragHover}
            dragCanDrop={handlers.dragCanDrop}
            componentId={componentId}
            childIndex={childIndex}
            componentProps={childProps}>
            {elem}
        </ComponentWrapper>);

        if (createOuterChildComponent !== null && typeof createOuterChildComponent === "function") {
            elem = createOuterChildComponent(elem, childProps, constraints);
        }

        children.push(elem);
    }

    // // If we are a template / layout and there are ready created components to be populated,
    // // populate them now:
    // if (zoneId && templateData && templateData.zoneComponents) {
    //     const componentsInZone = templateData.zoneComponents[zoneId];
    //     if (componentsInZone !== null && typeof componentsInZone !== "undefined") {
    //         let childIndex = 0;
    //         for (const c of componentsInZone) {
    //             const componentId = c["@id"];
    //             let elem = (<ComponentWrapper
    //                 key={firstNonNull(componentId, childIndex)}
    //                 dragHover={handlers.dragHover}
    //                 dragCanDrop={handlers.dragCanDrop}
    //                 componentId={componentId}
    //                 childIndex={childIndex}>
    //                 {c}</ComponentWrapper>);
    //             if (createOuterChildComponent !== null && typeof createOuterChildComponent === "function") {
    //                 elem = createOuterChildComponent(elem, c.props, c.constraints);
    //             }
    //
    //             children.push(elem);
    //
    //             childIndex++;
    //         }
    //     }
    // }
    return children;

}



