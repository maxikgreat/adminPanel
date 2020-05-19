import {SHOW_SUBMENU, HIDE_SUBMENU} from '../actionTypes';

const handlers = {
    [SHOW_SUBMENU]: (state, {payload}) => ({
        ...state,
        visible: true,
        coordX: payload.x,
        coordY: payload.y
    }),
    [HIDE_SUBMENU]: state => ({
        ...state,
        visible: false,
        coordX: 0,
        coordY: 0
    }),
    DEFAULT: state => state
}

export default function submenuReducer(state, action) {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
};