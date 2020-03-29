import {HIDE_ALERT, SHOW_ALERT} from "../actionTypes";

const handlers = {
    [SHOW_ALERT]: (state, {payload}) => {return(
        {
            ...state,
            isVisible: true,
            type: payload.type,
            headText: payload.headText,
            bodyText: payload.bodyText
        }
    )},
    [HIDE_ALERT]: (state) => {return(
        {
            ...state,
            isVisible: false,
            type: 'success',
            headText: '',
            bodyText: ''
        }
    )},
    DEFAULT: state => state
}

export default function alertReducer(state, action){
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}