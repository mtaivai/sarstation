import React from "react";
import {mergeClassNames} from "../util";

export default function HtmlContent(props) {

    const html = props.content;
    return (<span className={mergeClassNames("HtmlContent", props.className)} dangerouslySetInnerHTML={{"__html": html}}></span>);
}
