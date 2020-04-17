import React, {useState, useEffect} from "react";
import { Editor } from '@tinymce/tinymce-react';
import {mergeClassNames} from "../util";

export default function HtmlContent(props) {

    const {content, editorSite} = props;


    const editMode = false;
    // useEffect(() => {
    //     editorSite.isEditMode();
    // }, []);
    // const editMode = editorSite.isEditMode();

    //const [editMode, setEditMode] = useState(false);

    //props.editorSite.addEditMenuItem("Say hello", () => setEditMode(!editMode));

    console.log("EM", editMode);

    const handleEditorChange = (newContent, editor) => {
        console.log('Content was updated:', newContent);
    }

    if (editMode) {
        return (
            <Editor
                initialValue={content}
                init={{
                    height: 500,
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
        )
    } else {
        return (<span className={mergeClassNames("HtmlContent", props.className)} dangerouslySetInnerHTML={{"__html": content}}/>);
    }

}
