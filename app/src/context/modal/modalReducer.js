import {SHOW_MODAL, HIDE_MODAL} from "../actionTypes";

const handlers = {
    [SHOW_MODAL]: (state, {payload}) => {return(
        {
            ...state,
            isVisible: true,
            headText: payload.headText,
            bodyText: payload.bodyText,
            acceptAction: payload.acceptAction
        }
    )},
    [HIDE_MODAL]: (state) => {return(
        {
            ...state,
            isVisible: false,
            headText: "",
            bodyText: "",
            acceptAction: null
        }
    )},
    DEFAULT: state => state
}

export default function modalReducer(state, action) {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}
