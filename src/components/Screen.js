import React from "react";
import {createComponentByType} from "./Component";
import RootLayout from "./RootLayout";

function Screen(props) {

    let content;
    if (typeof(props.content) !== "undefined" && props.content !== null) {
        content = createComponentByType(props.content);
    } else {
        content = <div>Empty screen</div>;
    }
    return (
        <div className={"Screen"}>
            <RootLayout>
                {content}
            </RootLayout>
        </div>
    );

}

export default Screen;