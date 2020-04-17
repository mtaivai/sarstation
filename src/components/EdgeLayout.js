import React from "react";
import {createChildren} from "./Container.js";
import Container from 'react-bootstrap/Container';
import Col from "react-bootstrap/Col";

import "./EdgeLayout.scss";

function EdgeLayout(props) {

    //props.edge;

    const edgeChildren = {
        top: [],
        right: [],
        bottom: [],
        left: [],
        center: []
    };

    const children = createChildren(props,{
        childElementCreated: (childElement, childProps, constraints) => {
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
    } );

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
