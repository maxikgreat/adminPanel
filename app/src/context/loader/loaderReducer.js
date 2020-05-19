
import {SHOW_LOADER, HIDE_LOADER} from "../actionTypes";

const handlers = {
    [SHOW_LOADER]: state => ({
        ...state,
        isVisible: true
    }),
    [HIDE_LOADER]: state => ({
        ...state,
        isVisible: false
    }),
    DEFAULT: state => state
}

export default function loaderReducer(state, action){
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}