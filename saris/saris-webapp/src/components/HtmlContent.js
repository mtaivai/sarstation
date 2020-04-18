import React from "react";
import PropTypes from "prop-types";
import {mergeClassNames} from "../util";



// HtmlContent.editorTypes = {
//     content: string.isRequired,
// };


HtmlContent.propTypes = {
    content: PropTypes.string,
    editMode: PropTypes.bool,
    describeData: PropTypes.func.isRequired
}

export default function HtmlContent(props) {

    const {content, editMode, describeData} = props;

    describeData(() => [
        {
            name: "content",
            label: "Content",
            type: "html"
        }
    ]);

    // props.useEditor([
    //     {
    //         name: "content",
    //         type: "html"
    //     },
    // ]);

    //props.editorSite.addEditMenuItem("Say hello", () => setEditMode(!editMode));

    /*

    content: { type: html }

     */


    return (<span className={mergeClassNames("HtmlContent", props.className)} dangerouslySetInnerHTML={{"__html": content}}/>);

}
