import React, { useState, useCallback, useEffect } from 'react';

import './App.scss';
import Screen from "./components/Screen.js";
import {loadingScreen} from "./components/Loading.js";
import {fetchScreenIfNeeded} from "./features/screens/screenActions";
import { useDispatch, useSelector } from 'react-redux'
import {orElse} from "./util";

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

    const screenId = "screen1";

    const screen = useSelector(state => orElse(state.screens.entities[screenId], {}).screen);
    //const fetching = useSelector(state => state.screens.fetching);
    //const [fetchStatus, setFetchStatus] = useState(0);

    const dispatch = useDispatch()


    // Hmm... or is following better?
    // const { screen, fetching } = useSelector(state => ({
    //     screen: state.screen,
    //     fetching: state.fetching,
    // }), shallowEqual);





    // const fetchScreen = useCallback(
    //     () =>
    //         dispatch(fetchScreenIfNeeded()),
    //     [dispatch]
    // );
    //
    // fetchScreen();


    //const screen = screenEntity ? screenEntity.screen : null;

    useEffect(() => {
        //if (!screen && (!screenEntity || screenEntity.loading === "idle")) {
            dispatch(fetchScreenIfNeeded(screenId));
        //}
    }, [dispatch]);

    console.log("App", screen);

    if (screen) {
        return (<Screen {...screen}/>);
     } else {
        return loadingScreen();
     }

}


export default App;
