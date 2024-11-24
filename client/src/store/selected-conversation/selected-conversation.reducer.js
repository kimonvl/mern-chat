import SELECTED_CONVERSATION_ACTION_TYPES from "./selected-conversation.types";

const INITIAL_STATE = {
    selectedConversation: {},
}

export const selectedConversationReducer = (state = INITIAL_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case SELECTED_CONVERSATION_ACTION_TYPES.SET_SELECTED_CONVERSATION:
            return {...state, selectedConversation: payload};
    
        default:
            return state;
    }
}