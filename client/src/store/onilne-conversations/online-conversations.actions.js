import ONLINE_CONVERSATIONS_ACTION_TYPES from "./online-conversations.types"

export const setOnlineConversations = (conversations) => {
    console.log("online conv action set", conversations);
    return {type: ONLINE_CONVERSATIONS_ACTION_TYPES.SET_ONLINE_CONVERSATIONS, payload: conversations};
}

export const swapConversationToOnline = (conversation) => {
    console.log("online conv action swap online", conversation);
    return {type: ONLINE_CONVERSATIONS_ACTION_TYPES.SWAP_CONVERSATION_TO_ONLINE, payload: conversation};
}

export const swapConversationToOffline = (conversation) => {
    console.log("online conv action swap offline", conversation);
    return {type: ONLINE_CONVERSATIONS_ACTION_TYPES.SWAP_CONVERSATION_TO_OFFLINE, payload: conversation};
}

export const addMessageToConversation = (message) => {
    console.log("online conv action add message", message);
    return {type: ONLINE_CONVERSATIONS_ACTION_TYPES.ADD_MESSAGE_TO_CONVERSATION, payload: message};
}

