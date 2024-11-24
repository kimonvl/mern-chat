import { applyMiddleware, compose, createStore } from "redux";
import logger from "redux-logger";
import { rootReducer } from "./root-reducer";
import { selectedConversationMiddleware } from "./selected-conversation/selected-conversation.middleware";

const middleWares = [logger, selectedConversationMiddleware];

const composedEnhancers = compose(applyMiddleware(...middleWares));

export const store = createStore(rootReducer, undefined, composedEnhancers);