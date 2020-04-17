import {useDrag, useDrop} from "react-dnd";
import React, {useState, useRef} from "react";
import {setDraggedItem} from "../Screens";
import "./ComponentWrapper.scss"

import {DropdownButton, Dropdown} from "react-bootstrap";
import {orElse, resolveIndirect} from "../util";

let activeEditorMenu = null;

// TODO rename me... I'm no longer just for drag'n'drop...
export default function ComponentWrapper(props) {

    const [ hover, setHover ] = useState(false);
    const [ lockHover, setLockHover ] = useState(null);

    const [ editMode, setEditMode ] = useState(false);
    console.log("EDITMODE:", editMode);


    const ref = useRef(null);

    // This is a drag source, but also a drop target for ordering components inside of
    // a container
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


    const editorMenuRef = useRef();
    const dropdownOnToggle = (isOpen) => {
        if (isOpen) {
            activeEditorMenu = editorMenuRef;
            setLockHover(true);
        } else {
            if (activeEditorMenu === editorMenuRef) {
                activeEditorMenu = null;
            }
            setLockHover(false);

        }
    };

    const editorSite = resolveIndirect(props.componentProps.editorSite);
    if (editorSite !== null && typeof editorSite !== "undefined"){
        editorSite.isEditMode = () => editMode;
        editorSite.setEditMode = setEditMode;
    }

    let editorMenu = null;
    if (!editMode && (hover || lockHover)) {

        const dropdownItems = [];
        if (editorSite !== null && typeof editorSite !== "undefined") {

            const menuItems = orElse(editorSite.menuItems, []);
            for (const menuItem of menuItems) {
                dropdownItems.push(
                    <Dropdown.Item onSelect={(eventKey, event) => {
                        menuItem.action();
                    }}>
                        {menuItem.label}
                    </Dropdown.Item>);
            }
            //
            // <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            // <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>

        }

        editorMenu = (
            <Dropdown onToggle={dropdownOnToggle} >
                <Dropdown.Toggle size={"sm"}  variant="success" id="dropdown-basic">
                    Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu alignRight>
                    {dropdownItems}
                </Dropdown.Menu>
            </Dropdown>
        );
    }


    return (
        <div
             ref={ref}
             style={isOver ? {border: "1px solid red"} : {}}
             onMouseEnter={() => setHover(true) }
             onMouseLeave={() => setHover(false) }
             className={"ComponentWrapper Draggable" + (isDragging ? " Dragging" : "")}>
            <div className={"ComponentMenu"}>
                {editorMenu}
            </div>
            <div className={"Body"}>
                {props.children}
            </div>
        </div>
    )
}

