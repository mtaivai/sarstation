import React, { useState, useEffect } from 'react';

import './App.css';
import { loadScreen} from "./Screens.js";
import Screen from "./components/Screen.js";
import {loadingScreen} from "./components/Loading.js";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const [screen, setScreen] = useState(null);
    const [fetchStatus, setFetchStatus] = useState(0);

    useEffect(() => {
        if (fetchStatus === 0) {
            console.log("Loading screen...");
            setFetchStatus(1);
            loadScreen().then((screen) => {
                    console.log("Screen loaded", screen);
                    setFetchStatus(2);
                    setScreen(screen);
                });

        }
    }, [fetchStatus]);

    if (fetchStatus < 2) {
        return loadingScreen();
    } else {
        return (<Screen {...screen}/>);
    }
}


export default App;
