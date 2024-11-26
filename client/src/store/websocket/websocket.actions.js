import WEBSOCKET_ACTION_TYPES from "./websocket.types"

export const wsConnect = () => {return {type:WEBSOCKET_ACTION_TYPES.WS_CONNECT, payload: null};}

export const wsDissconnect = () => {return {type:WEBSOCKET_ACTION_TYPES.WS_DISSCONNECT, payload: null};}