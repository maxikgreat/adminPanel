import React, { useReducer } from 'react';
import {SubmenuContext} from './submenuContext';
import submenuReducer from './submenuReducer';
import {SHOW_SUBMENU, HIDE_SUBMENU} from '../actionTypes';

export const SubmenuState = ({children}) => {

    const initialState = {
        visible: false,
        coordX: 0,
        coordY: 0,
        textOpts: ['bold', 'italic'],
        colorOpts: ['#ee6178', '#f7ba6b', '#aa65f7', '#45a5ac', '#b8f547']
    };

    const [state, dispatch] = useReducer(submenuReducer, initialState);

    const showSubmenu = (x, y) => dispatch({
        type: SHOW_SUBMENU,
        payload: {x, y}
    })
    const hideSubmenu = () => dispatch({type: HIDE_SUBMENU})

    return (
        <SubmenuContext.Provider value={{showSubmenu, hideSubmenu, submenu: state}}>
            {children}
        </SubmenuContext.Provider>
    )
}