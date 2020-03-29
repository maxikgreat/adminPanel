
import React from 'react'
import {SHOW_LOADER, HIDE_LOADER} from "../actionTypes";
import {useReducer} from "react";
import loaderReducer from "./loaderReducer";
import {LoaderContext} from "./loaderContext";


const initialState = {
    isVisible: true
}

export const LoaderState = ({children}) => {

    const [state, dispatch] = useReducer(loaderReducer, initialState);

    const show = () => {
        dispatch({
            type: SHOW_LOADER
        })
    }

    const hide = () => {
        dispatch({
            type: HIDE_LOADER
        })
    }

    return(
        <LoaderContext.Provider value = {{loaderShow: show, loaderHide: hide, loader: state}}>
            {children}
        </LoaderContext.Provider>
    )
}