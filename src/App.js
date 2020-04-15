import React, { useState, useCallback, useEffect } from 'react';

import './App.css';
import Screen from "./components/Screen.js";
import {loadingScreen} from "./components/Loading.js";
import {fetchScreenIfNeeded} from "./features/screens/screenActions";
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const screen = useSelector(state => state.screens.screen);
    //const fetching = useSelector(state => state.screens.fetching);
    //const [fetchStatus, setFetchStatus] = useState(0);

    const dispatch = useDispatch()


    // TODO or is following better?
    // const { screen, fetching } = useSelector(state => ({
    //     screen: state.screen,
    //     fetching: state.fetching,
    // }), shallowEqual);


    useEffect(() => {
        if (screen === null || typeof screen === "undefined") {
            // Start fetching
            dispatch(fetchScreenIfNeeded());
        }
    }, [dispatch]);


    // const fetchScreen = useCallback(
    //     () =>
    //         dispatch(fetchScreenIfNeeded()),
    //     [dispatch]
    // );
    //
    // fetchScreen();



    console.log("App", screen);

    if (screen) {
        return (<Screen {...screen}/>);
     } else {
        return loadingScreen();
     }

}


export default App;
