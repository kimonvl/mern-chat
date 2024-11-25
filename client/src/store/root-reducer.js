import { combineReducers } from "redux";
import { userReducer } from "./user/user.reducer";
import { selectedConversationReducer } from "./selected-conversation/selected-conversation.reducer";
import { onlineConversationsReducer } from "./onilne-conversations/online-conversations.reducer";
import { websocketReducer } from "./websocket/websocket.reducer";

export const rootReducer = combineReducers({
    user: userReducer,
    selectedConversation: selectedConversationReducer,
    onlineConversations: onlineConversationsReducer,
    websocket: websocketReducer,
})