import { combineReducers } from "redux";
import { userReducer } from "./user/user.reducer";
import { selectedConversationReducer } from "./selected-conversation/selected-conversation.reducer";
import { onlineConversationsReducer } from "./onilne-conversations/online-conversations.reducer";
import { websocketReducer } from "./websocket/websocket.reducer";
import { usersSearchResultReducer } from "./users-search-result/users-search-result.reducer";

export const rootReducer = combineReducers({
    user: userReducer,
    selectedConversation: selectedConversationReducer,
    onlineConversations: onlineConversationsReducer,
    usersSearchResult: usersSearchResultReducer,
    websocket: websocketReducer,
})