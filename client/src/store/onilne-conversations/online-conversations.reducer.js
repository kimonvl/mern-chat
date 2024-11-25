import ONLINE_CONVERSATIONS_ACTION_TYPES from "./online-conversations.types";

const INITIAL_STATE = {
    onlineConversations: {online:[], offline:[]},
}

export const onlineConversationsReducer = (state = INITIAL_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case ONLINE_CONVERSATIONS_ACTION_TYPES.SET_ONLINE_CONVERSATIONS:
            return {...state, onlineConversations: payload};
    
        default:
            return state;
    }
}