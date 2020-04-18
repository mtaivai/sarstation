import {useDrag, useDrop} from "react-dnd";
import React, {useState, useRef} from "react";
import {setDraggedItem} from "../Screens";
import "./ComponentWrapper.scss"

import {DropdownButton, Dropdown, ButtonGroup, Button} from "react-bootstrap";
import {orElse, resolveIndirect} from "../util";
import {createComponentByType} from "./Component";
import ModalEditor from "./ModalEditor";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
import {findComponentHavingId, updateScreenComponent} from "../features/screens/screenActions";

let activeEditorMenu = null;

ComponentWrapper.propTypes = {
    componentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    componentProps: PropTypes.object.isRequired,
    screenId: PropTypes.string.isRequired,
    dragHover: PropTypes.func,
    dragCanDrop: PropTypes.func,
    createChildElement: PropTypes.func.isRequired,
    childElementCreated: PropTypes.func
}
export default function ComponentWrapper(props) {

    const {componentId, componentProps, screenId, dragHover, dragCanDrop, createChildElement, childElementCreated } = props;

    const [ editMode, setEditMode ] = useState(false);

    const [ hover, setHover ] = useState(false);
    const [ lockHover, setLockHover ] = useState(null);

    const dispatch = useDispatch();

    const screen = useSelector(state => orElse(state.screens.entities[screenId], {}).screen);

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

            if (typeof dragHover === "function") {
                dragHover(item, monitor, props, hoverBoundingRect);
            }

        },
        canDrop: (i, m) => typeof dragCanDrop === "function" ? dragCanDrop(i, m) : true,
        drop: () => {
               console.log("DROP1");
               },
        collect: mon => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop(),
        })
    })

    const dragItem = { type: "Component", componentId};

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

    // TODO we don't have editorSite any more
    const editorSite = resolveIndirect(componentProps.editorSite);
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
            <Dropdown as={ButtonGroup} onToggle={dropdownOnToggle} >

                <Button variant={"primary"} size={"sm"}
                    onClick={() => setEditMode(true)}>Edit</Button>
                <Dropdown.Toggle split variant={"secondary"} size={"sm"} />

                <Dropdown.Menu alignRight>
                    {dropdownItems}
                    <Dropdown.Item onSelect={(eventKey, event) => {
                        setEditMode(true);
                    }}>Edit</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    let dataDescription = {};

    function describeData(description) {
        if (description !== null && typeof description !== "undefined") {
            dataDescription = description;
        }
        return dataDescription;
    }

    // Finally create the child component:
    // TODO add editor site?
    const childElement = createChildElement({...componentProps, editMode, describeData});
    if (childElementCreated !== null && typeof childElementCreated !== "undefined") {
        childElementCreated(childElement, componentProps);
    }

    const editModeElements = [];
    if (editMode) {



        let currentContent = undefined;
        function getCurrentData() {
            if (currentContent === undefined) {
                currentContent = findComponentHavingId(componentId, screen);
            }
            return currentContent;
        }

        function saveData(newData) {
            console.log("Save data:", newData);

            dispatch(updateScreenComponent(screenId, componentId, newData));

        }



        editModeElements.push(
            <ModalEditor key={"modalEditor"}
                         onClose={() => {setEditMode(false); setHover(false);}}
                         targetProps={{...componentProps}}
                         describeData={() => dataDescription}
                         getCurrentData={ getCurrentData }
                         saveData={ saveData }
                         />
            );
    }

    const onMouseEnter = (e) => { setHover(true); };
    const onMouseLeave = () => { setHover(false); };


    return (
        <div
             ref={ref}
             style={isOver ? {border: "1px solid red"} : {}}
             onMouseEnter={ onMouseEnter }
             onMouseLeave={ onMouseLeave }
             className={"ComponentWrapper Draggable" + (isDragging ? " Dragging" : "")}>
            <div className={"ComponentHeader"}>
                <div className={"ComponentMenu"}>{editorMenu}</div>
            </div>

            <div className={"Body"}>
                {childElement}
                {editModeElements}
            </div>

        </div>
    )
}

