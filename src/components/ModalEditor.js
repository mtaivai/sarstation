import React from 'react';
import Modal from 'react-modal';
import { Editor } from "@tinymce/tinymce-react";

import {Form, Button} from "react-bootstrap";

import {orElse, resolveIndirect} from "../util";
import TextField from "./editor/TextField";
import HtmlEditorField from "./editor/HtmlEditorField";

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')



export default function ModalEditor(props) {

    const {onClose, targetProps, describeData, getCurrentData, saveData} = props;

    const dataDescription = resolveIndirect(describeData);

    function getInitialFieldValues() {
        if (dataDescription != null && typeof dataDescription !== "undefined") {
            const currentData = getCurrentData();
            const initialFieldValues = {};
            for (const fieldDescription of dataDescription) {
                const name = fieldDescription.name;
                if (currentData && !initialFieldValues.hasOwnProperty(name)) {
                    initialFieldValues[name] = currentData[name];
                }
            }
            return initialFieldValues;
        }
    }

    const [isOpen, setIsOpen] = React.useState(true);
    const [isModified, setIsModified] = React.useState(false);
    const [fieldValues, setFieldValues] = React.useState({});
    const [initialFieldValues, setInitialFieldValues] = React.useState(getInitialFieldValues);

    let subtitle;



    const editorFields = [];

    function createField(fieldDescription) {
        const type = orElse(fieldDescription.type, "").trim().toLowerCase();
        const name = fieldDescription.name;
        const initialValue = initialFieldValues[name];
        const placeholderText = "Enter " + fieldDescription.label;

        function handleChangeTextValue(ev, newValue) {
            console.log("handleChangeTextValue1 modified, fieldValues, newValue:", isModified, fieldValues, newValue);
            fieldValues[name] = newValue;

            const modified = (newValue !== initialValue || typeof initialValue === "undefined");
            if (modified !== isModified) {
                console.log("Set modified:", modified);
                setIsModified(modified);
                setFieldValues(fieldValues);
            }
            console.log("handleChangeTextValue2 modified, fieldValues:", isModified, fieldValues);
        }

        switch (type) {
            case "string":
                return (
                    <TextField key={name}
                           label={fieldDescription.label}
                           placeholder={placeholderText}
                           initialValue={initialValue}
                           onChange={handleChangeTextValue}
                    />);
            case "html":
                return (
                    <HtmlEditorField key={name}
                           label={fieldDescription.label}
                           placeholder={placeholderText}
                           initialValue={initialValue}
                           onChange={handleChangeTextValue}
                />);

            default:
                return null;
        }
    }


    if (dataDescription != null && typeof dataDescription !== "undefined") {

        for (const fieldDescription of dataDescription) {

            const name = fieldDescription.name;

            const f = createField(fieldDescription);
            if (f) {
                editorFields.push(f)
            } else {
                console.warn("Couldn't create field of type '" + fieldDescription.type + "' for description:", fieldDescription);
            }
        }

    }


    // for (const name in props.targetProps) {
    //     if (!props.targetProps.hasOwnProperty(name)) {
    //         continue;
    //     }
    //     const value = props.targetProps[name];
    //     editorFields.push((<div key={"property_" + name}>{name}</div>));
    // }
    // content
    // preferences


    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function saveAndCloseModal(){
        if (onClose !== null && typeof onClose !== "undefined") {

            console.log("Save", isModified, fieldValues);
            if (isModified && saveData !== null && typeof saveData !== "undefined") {
                saveData(fieldValues);
            }

            onClose();
            setIsOpen(false);
        }
    }

    return (
            <Modal
                isOpen={isOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={saveAndCloseModal}
                style={customStyles}
                contentLabel="Settings of Component Untitled"
                shouldCloseOnOverlayClick={false}

            >

                <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2>

                <Form>
                    {editorFields}
                    <Button variant="primary" type="button" onClick={ saveAndCloseModal } disabled={!isModified}>
                        Tallenna
                    </Button>

                </Form>




            </Modal>
    );
}
