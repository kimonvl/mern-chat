import { setOnlineConversations } from "../onilne-conversations/online-conversations.actions";
import SELECTED_CONVERSATION_ACTION_TYPES from "./selected-conversation.types"

export const selectedConversationMiddleware = (store) => (next) => (action) => {
    switch (action.type) {
        case SELECTED_CONVERSATION_ACTION_TYPES.SET_SELECTED_CONVERSATION:
            const currentOnlineConversations = store.getState().onlineConversations.onlineConversations;
            console.log("set selected conv with: ", action.payload);
            if(action.payload.hasOwnProperty("messages"))
            { 
                let foundOnline = currentOnlineConversations.online.find((conv) => {return conv.convId == action.payload.messages[0].conversationId});
                let foundOffline = currentOnlineConversations.offline.find((conv) => {return conv.convId == action.payload.messages[0].conversationId})
                if(foundOnline){
                    const newSelectedConv = {...foundOnline, messages: action.payload.messages};

                    action.payload = newSelectedConv;

                    foundOnline.unreadMessages = 0;
                    store.dispatch(setOnlineConversations({...currentOnlineConversations}));
                }else if(foundOffline){
                    const newSelectedConv = {...foundOffline, messages: action.payload.messages};
                    action.payload = newSelectedConv;

                    foundOffline.unreadMessages = 0;
                    store.dispatch(setOnlineConversations({...currentOnlineConversations}));
                }else {
                    console.log("cant find conversation");
                }
            }else {
                const foundOnline = currentOnlineConversations.online.find((conv) => {return conv.convId == action.payload.convId});
                const foundOffline = currentOnlineConversations.offline.find((conv) => {return conv.convId == action.payload.convId})
                if(foundOnline){
                    const newSelectedConv = {...foundOnline, messages: []};
                    action.payload = newSelectedConv;
                }else if(foundOffline){
                    const newSelectedConv = {...foundOffline, messages: []};
                    action.payload = newSelectedConv;
                }else {
                    console.log("cant find conversation");
                }
            }
            localStorage.setItem('selected-conversation', JSON.stringify(action.payload));
            break;
    
        default:
            break;
    }
        
    return next(action);
}