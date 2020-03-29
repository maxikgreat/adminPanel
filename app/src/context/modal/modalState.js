
import React, {useReducer} from 'react'
import modalReducer from "./modalReducer";
import {HIDE_MODAL, SHOW_MODAL} from "../actionTypes";
import {ModalContext} from "./modalContext";

const initialState = {
    isVisible: false,
    headText: "",
    bodyText: "",
    acceptAction: null
}

export const ModalState = ({children}) => {
    const [state, dispatch]= useReducer(modalReducer, initialState)

    const hide = () => {
        dispatch({
            type: HIDE_MODAL
        })
    }

    const show = (headText, bodyText, acceptAction) => {
        dispatch({
            type: SHOW_MODAL,
            payload: {headText, bodyText, acceptAction}
        })
    }

    return(
        <ModalContext.Provider value={{hide, show, modal: state}}>
            {children}
        </ModalContext.Provider>
    )

}