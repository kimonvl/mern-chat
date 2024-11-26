import { setSelectedConversation } from "../selected-conversation/selected-conversation.actions";
import { setOnlineConversations } from "./online-conversations.actions";
import ONLINE_CONVERSATIONS_ACTION_TYPES from "./online-conversations.types";

export const onlineConversationsMiddleware = (store) => (next) => (action) => {
    
    switch (action.type) {
        case ONLINE_CONVERSATIONS_ACTION_TYPES.SWAP_CONVERSATION_TO_ONLINE:
            
            {const currentOnlineConversations = store.getState().onlineConversations.onlineConversations;
                        let convosToSwap = []
            const newOfflineConvos = currentOnlineConversations.offline.filter((offlineConv) => {
                const foundParticipant = offlineConv.participants.find((participant) => {return participant.userId.toString() == action.payload;})
                if(foundParticipant) {
                    convosToSwap.push(offlineConv);
                    return false;
                }
                return true;
            });
            const newOnlineConvos = [...currentOnlineConversations.online, ...convosToSwap];
            // @ts-ignore
            store.dispatch(setOnlineConversations({online: newOnlineConvos, offline: newOfflineConvos}));
            break;}

        case ONLINE_CONVERSATIONS_ACTION_TYPES.ADD_MESSAGE_TO_CONVERSATION:

            {const currentSelectedConversation = store.getState().selectedConversation.selectedConversation;
            const currentOnlineConversations = store.getState().onlineConversations.onlineConversations;
            console.log("message recieved slected conv", currentSelectedConversation);
            if(currentSelectedConversation.convId == action.payload.conversationId){
                const newSelectedconv = {...currentSelectedConversation, messages: [...currentSelectedConversation.messages, action.payload]};
                store.dispatch(setSelectedConversation(newSelectedconv));
                //comunicate to server that the message is read here
                const currentSocket = store.getState().websocket.socket;
                const currentUserId = store.getState().user.userId;
                if(currentSocket.readyState == 1){
                    currentSocket.send(JSON.stringify({type: "message-read", data: {msgId: action.payload._id, readById: currentUserId}}))
                }
            }else{
                let foundOnline = currentOnlineConversations.online.find((conv) => {return conv.convId == action.payload.conversationId});
                let foundOffline = currentOnlineConversations.offline.find((conv) => {return conv.convId == action.payload.conversationId});
                if(foundOnline) {
                    foundOnline.unreadMessages += 1;
                    // @ts-ignore
                    store.dispatch(setOnlineConversations({...currentOnlineConversations}));
                }else if(foundOffline) {
                    foundOffline.unreadMessages += 1;
                    // @ts-ignore
                    store.dispatch(setOnlineConversations({...currentOnlineConversations}));
                }
            }
            break;}
        case ONLINE_CONVERSATIONS_ACTION_TYPES.SWAP_CONVERSATION_TO_OFFLINE:

            {const currentOnlineConversations = store.getState().onlineConversations.onlineConversations;
            let convosToSwap = []
            const newOnlineConvos = currentOnlineConversations.online.filter((onlineConv) => {
                const foundParticipant = onlineConv.participants.find((participant) => {return participant.userId.toString() == action.payload;})
                if(foundParticipant) {
                    convosToSwap.push(onlineConv);
                    return false;
                }
                return true;
            });
            const newOfflineConvos = [...currentOnlineConversations.offline, ...convosToSwap];
            store.dispatch(setOnlineConversations({online: newOnlineConvos, offline: newOfflineConvos}));
            break;}

        case ONLINE_CONVERSATIONS_ACTION_TYPES.ADD_CONVERSATION_TO_ONLINES:
            {const currentOnlineConversations = store.getState().onlineConversations.onlineConversations;
            console.log("adding conv ", {online: [...currentOnlineConversations.online, action.payload], offline: [...currentOnlineConversations.offline]});
            store.dispatch(setOnlineConversations({online: [...currentOnlineConversations.online, action.payload], offline: [...currentOnlineConversations.offline]}))
            break;}
            
        default:
            break;
    }
    return next(action);
} 