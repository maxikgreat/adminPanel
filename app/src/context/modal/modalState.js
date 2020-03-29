
import React, {useReducer} from 'react'
import modalReducer from "./modalReducer";
import {HIDE_MODAL, SHOW_MODAL} from "../actionTypes";
import {ModalContext} from "./modalContext";

const initialState = {
    isVisible: false,
    type: "text",
    headText: "",
    body: "",
    acceptAction: null
}

export const ModalState = ({children}) => {

    const [state, dispatch]= useReducer(modalReducer, initialState)

    const hide = () => {
        dispatch({
            type: HIDE_MODAL
        })
    }

    const show = (type, headText, body, acceptAction) => {
        dispatch({
            type: SHOW_MODAL,
            payload: {type, headText, body, acceptAction}
        })
    }

    return(
        <ModalContext.Provider value={{modalHide: hide, modalShow: show, modal: state}}>
            {children}
        </ModalContext.Provider>
    )

}