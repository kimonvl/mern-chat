import WEBSOCKET_ACTION_TYPES from "./websocket.types";

const INITIAL_STATE = {
    socket: null,
    isLoggedIn: false,
}

export const websocketReducer = (state = INITIAL_STATE, action) => {
    const {type} = action;

    switch (type) {
        case WEBSOCKET_ACTION_TYPES.WS_CONNECT:
            console.log("dispatched until socket reducer", action.payload)
            return {...state,socket: action.payload, isLoggedIn: true};
        case WEBSOCKET_ACTION_TYPES.WS_DISSCONNECT:
            return {...state, isLoggedIn: false};
        default:
            return state;
    }
}