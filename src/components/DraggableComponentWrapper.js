import {useDrag, useDrop} from "react-dnd";
import React, {useRef} from "react";
import {setDraggedItem} from "../Screens";

export default function DraggableComponentWrapper(props) {

    // Drag source, but also a drop target for ordering components inside of
    // a container

    const ref = useRef(null);

    const [{isOver, canDrop}, drop] = useDrop({
        accept: "Component",
        hover: (item, monitor) => {

            if (!ref.current) {
                return;
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect()

            if (typeof props.dragHover === "function") {
                props.dragHover(item, monitor, props, hoverBoundingRect);
            }

        },
        canDrop: (i, m) => typeof props.dragCanDrop === "function" ? props.dragCanDrop(i, m) : true,
        drop: () => {
               console.log("DROP1");
               },
        collect: mon => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop(),
        })
    })

    const dragItem = { type: "Component", componentId: props.componentId };

    const [{isDragging}, drag] = useDrag({
        item: dragItem,
        begin: (monitor) => { setDraggedItem(dragItem) },
        end: (item, monitor) => { console.log("End", item, monitor);},
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    drag(drop(ref));



    // const children = Array.isArray(props.children) ? props.children : [props.children];

    // for (const child of children) {
    //     const childProps = {...child.props};
    //     if (isDragging) {
    //         childProps.style["opacity"] = "0.5";
    //     }
    //     childProps.cursor = "move";
    //     child.props = childProps;
    // }



    return (
        <div
             ref={ref}
             style={isOver ? {border: "1px solid red"} : {}}
             className={"Draggable" + (isDragging ? " Dragging" : "")}>
            {props.children}
        </div>
    )
}

