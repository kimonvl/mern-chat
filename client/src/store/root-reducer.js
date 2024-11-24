import { combineReducers } from "redux";
import { userReducer } from "./user/user.reducer";
import { selectedConversationReducer } from "./selected-conversation/selected-conversation.reducer";

export const rootReducer = combineReducers({
    user: userReducer,
    selectedConversation: selectedConversationReducer,
})