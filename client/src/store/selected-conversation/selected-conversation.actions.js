import SELECTED_CONVERSATION_ACTION_TYPES from "./selected-conversation.types";

export const setSelectedConversation = (conversation) => {
    return {type: SELECTED_CONVERSATION_ACTION_TYPES.SET_SELECTED_CONVERSATION, payload: conversation};
}