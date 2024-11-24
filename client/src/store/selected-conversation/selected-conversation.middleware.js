import SELECTED_CONVERSATION_ACTION_TYPES from "./selected-conversation.types"

export const selectedConversationMiddleware = (store) => (next) => (action) => {
    if(action.type == SELECTED_CONVERSATION_ACTION_TYPES.SET_SELECTED_CONVERSATION){
        const {payload} = action;

        console.log("save selected conv to storage", payload);
        localStorage.setItem('selected-conversation', JSON.stringify(payload));
    }
    return next(action);
}