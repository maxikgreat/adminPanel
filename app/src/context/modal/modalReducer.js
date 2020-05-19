import {SHOW_MODAL, HIDE_MODAL} from "../actionTypes";

const handlers = {
    [SHOW_MODAL]: (state, {payload}) => ({
        ...state,
        isVisible: true,
        type: payload.type,
        headText: payload.headText,
        body: payload.body,
        acceptAction: payload.acceptAction
    }),
    [HIDE_MODAL]: state => ({
        ...state,
        isVisible: false,
    }),
    DEFAULT: state => state
}

export default function modalReducer(state, action) {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}
