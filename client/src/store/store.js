import { applyMiddleware, compose, createStore } from "redux";
//import logger from "redux-logger";
import { rootReducer } from "./root-reducer";
import { selectedConversationMiddleware } from "./selected-conversation/selected-conversation.middleware";
import { websocketMiddleware } from "./websocket/websocket.middleware";
import { onlineConversationsMiddleware } from "./onilne-conversations/online-conversations.middleware";

const logger = (store) => (next) => (action) => {
    if(!action.type)
        return next(action);

    console.log("type: ", action.type);
    console.log("payload: ", action.payload);
    console.log("current state: ", store.getState());

    next(action);

    console.log("next state: ", store.getState());
}

const middleWares = [logger, selectedConversationMiddleware, websocketMiddleware, onlineConversationsMiddleware];

const composedEnhancers = compose(applyMiddleware(...middleWares));

export const store = createStore(rootReducer, undefined, composedEnhancers);