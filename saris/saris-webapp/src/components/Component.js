import React from "react";

import EdgeLayout from "./EdgeLayout.js";
import FlowLayout from "./FlowLayout.js";
import HtmlContent from "./HtmlContent.js";

function createComponentByType(props) {

    switch(props.type) {
        case "EdgeLayout":
            return React.createElement(EdgeLayout, props);
        case "FlowLayout":
            return React.createElement(FlowLayout, props);
        case "HtmlContent":
            return React.createElement(HtmlContent, props);
        default:
            return <div>Unknown type: {props.type}</div>
    }
}

function Component(props) {

    // Render any component


    switch (props.type) {

    }


    return (<div>{JSON.stringify(props)}</div>)
}

export {Component, createComponentByType};