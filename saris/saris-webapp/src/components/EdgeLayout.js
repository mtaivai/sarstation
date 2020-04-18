import React from "react";
import {createChildren} from "./Container.js";
import Container from 'react-bootstrap/Container';

import "./EdgeLayout.scss";

function EdgeLayout(props) {

    const children = createChildren(props,{} );

    console.log("All children:", children);

    const edgeChildren = {
        top: [],
        right: [],
        bottom: [],
        left: [],
        center: []
    };

    for (const child of children) {
        const props = child.properties;
        const childElement = child.element;
        const constraints = props.layoutConstraints;
        let edge = (constraints != null && typeof constraints !== undefined) ? constraints["edge"] : null;
        if (edge !== null && typeof edge !== "undefined") {
            edge = edge.toLowerCase();
        } else {
            edge = "center";
        }
        switch (edge) {
            case "top":
                edgeChildren.top.push(childElement);
                break;
            case "right":
                edgeChildren.right.push(childElement);
                break;
            case "bottom":
                edgeChildren.bottom.push(childElement);
                break;
            case "left":
                edgeChildren.left.push(childElement);
                break;
            case "center":
            default:
                edgeChildren.center.push(childElement);
                break;

        }
    }


    return (
        <div className={"EdgeLayout"}>
            <div className={"Top Row"}>
                <div className={"Center ContainerArea"}>
                    <Container fluid>{edgeChildren.top}</Container>
                </div>
            </div>
            <div className={"Middle Row"}>
                <div className={"Left ContainerArea"}>
                    <Container fluid>{edgeChildren.left}</Container>
                </div>
                <div className={"Center ContainerArea"}>
                    <div className={"DropZone Before"}/>
                    <Container fluid>{edgeChildren.center}</Container>
                    <div className={"DropZone After"}/>
                </div>
                <div className={"Right ContainerArea"}>
                    <Container fluid>{edgeChildren.right}</Container>
                </div>
            </div>
            <div className={"Bottom Row"}>
                <div className={"Center ContainerArea"}>
                    <Container fluid>{edgeChildren.bottom}</Container>
                </div>
            </div>
        </div>

    );

}
export default EdgeLayout;
