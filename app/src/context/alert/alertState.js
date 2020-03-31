
import {AlertContext} from "./alertContext";
import React, {useReducer} from "react";
import {SHOW_ALERT,HIDE_ALERT} from "../actionTypes";
import alertReducer from "./alertReducer";

const initialState = {
    isVisible: false,
    type: '',
    headText: '',
    bodyText: ''
};


export const AlertState = ({children}) => {

    const [state, dispatch] = useReducer(alertReducer, initialState);

    const autoShow = (type, headText, bodyText) => {
        dispatch({
            type: SHOW_ALERT,
            payload: {type, headText, bodyText}
        });
        setTimeout(() => {
            dispatch({
                type: HIDE_ALERT
            })
        }, 3000)
    };

    return(
        <AlertContext.Provider value = {{alertShow: autoShow, alert: state}}>
            {children}
        </AlertContext.Provider>
    )
};

