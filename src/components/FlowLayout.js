import React, {useState, useRef} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useDrop} from "react-dnd";
import {createChildren} from "./Container.js";

const deviceSizes = ["xs", "sm", "md", "lg", "xl"];

function FlowLayout(props) {

    const [dropZoneAfterChildIndex, setDropZoneAfterChildIndex] = useState(null);


    function setColumnLayoutConstraints(constraints, targetProps, deviceSize) {
        if (constraints === null || typeof constraints === "undefined"
            || constraints[deviceSize] === null || typeof constraints[deviceSize] === "undefined"
            || targetProps === null || typeof targetProps === "undefined"
            || deviceSize === null || typeof deviceSize === "undefined") {

            return;
        }

        let sourceVal;
        if (typeof constraints[deviceSize] === "function") {
            sourceVal = constraints[deviceSize]();
        } else {
            sourceVal = constraints[deviceSize];
        }

        let setVal;

        let anythingSet = false;

        if (typeof val === "string" || typeof val === "number") {
            setVal = sourceVal;
            anythingSet = true;
        } else {
            setVal = {};

            const copyProps = ["cols", "offset", "order", "span"];
            for (const p of copyProps) {
                if (sourceVal[p] !== null && typeof sourceVal[p] !== "undefined") {
                    setVal[p] = sourceVal[p];
                    anythingSet = true;
                }
            }
        }

        if (anythingSet) {
            targetProps[deviceSize] = setVal;
        }

    }

    // props.components.splice(
    //     1, 0, {
    //         component: {type: "HtmlContent"},
    //         constraints: {}
    //     });
    const children = createChildren(props, {
        createOuterChildComponent: (child, childProps, constraints) => {

            const colProps = {};
            for (const deviceSize of deviceSizes) {
                setColumnLayoutConstraints(constraints, colProps, deviceSize);
            }
            colProps.key = child.key;

            const elems = [(<Col {...colProps}>{child}</Col>)];

            if (dropZoneAfterChildIndex !== null && dropZoneAfterChildIndex === childProps.childIndex) {
                elems.push(<Col style={{border: "1px solid red"}} key={"DZPH" + childProps.childIndex}/>);
            }

            return elems;
        },

        dragHover: (item, monitor, targetProps, hoverBoundingRect) => {

            // Get middle point and determine which side of this component should
            // the dragged item to be dropped:
            const hoverMiddleX =
                (hoverBoundingRect.right - hoverBoundingRect.left) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the left
            const hoverClientX = clientOffset.x - hoverBoundingRect.left

            // How to add?

            if (hoverClientX < hoverMiddleX) {
                console.log("Left of ", targetProps.componentId);
                //setDropZoneAfterComponentId(targetProps.childIndex - 1);
            } else {
                console.log("Right of ", targetProps.componentId);
                //setDropZoneAfterChildIndex(targetProps.childIndex);
            }

        }
    });

    // Set row constraints:
    const rowProps = {};
    let columnWidth = props["columnWidth"];
    if (columnWidth !== null && typeof columnWidth !== "undefined") {
       if (typeof columnWidth === "function") {
           columnWidth = columnWidth();
       }
       if (typeof columnWidth === "object") {
           // Per screen size
           for (const deviceSize of deviceSizes) {
               let widthValue = columnWidth[deviceSize];
               if (typeof v === "function") {
                   widthValue = widthValue();
               }
               if (widthValue !== null && typeof widthValue !== "undefined" && widthValue !== "") {
                   rowProps[deviceSize] = widthValue;
               }
           }
       } else {
           for (const deviceSize of deviceSizes) {
               rowProps[deviceSize] = columnWidth;
           }
       }
    }


    function moveKnight(x, y) {
        console.log("moveKnight", x, y);
    }

    const ref = useRef(null);


    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "Component",
        hover: (item, monitor) => {

            if (!ref.current) {
                return;
            }
            const clientOffset = monitor.getClientOffset()
           // console.log("hover", item, monitor, clientOffset);



        },
        canDrop: () => true,
        drop: () => moveKnight(0, 1),
        collect: mon => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop(),
        })
    })

    drop(ref);
    return (
        <Container fluid ref={ref}>
            <Row className={"ContainerArea"} {...rowProps}>
                {children}
            </Row>
        </Container>
    );
}
export default FlowLayout;