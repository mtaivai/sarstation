
import React from "react";
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import "./RootLayout.scss"

export default function RootLayout(props) {

    return (
        <DndProvider backend={Backend}>
            <div className={"RootLayout"}>
                {props.children}
            </div>
        </DndProvider>
    );
}