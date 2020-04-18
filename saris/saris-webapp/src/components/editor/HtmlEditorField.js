import React from 'react';
import { Editor } from "@tinymce/tinymce-react";

import {Form, Button} from "react-bootstrap";

import {orElse} from "../../util";



export default function HtmlEditorField(props) {

    const {initialValue, name, label, placeholder, onChange} = props;

    const [value, setValue] = React.useState(orElse(initialValue, ""));

    const renderLabel = () => {
        if (label !== null && typeof label !== "undefined") {
            return (<Form.Label>{label}</Form.Label>);
        } else {
            return null;
        }
    }

    const handleEditorChange = (newContent, editor) => {
        // console.log('Content was updated:', newContent);
        if (onChange !== null && typeof onChange !== "undefined") {
            onChange(null, newContent);
        }
    }

    return (
        <Form.Group controlId="formBasicEmail">
            {renderLabel()}
            <Editor
                initialValue={value}
                init={{
                    //height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
                }}
                onEditorChange={handleEditorChange}
            />
        </Form.Group>
    );

}
