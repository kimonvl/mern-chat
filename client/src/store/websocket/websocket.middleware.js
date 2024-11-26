import { setOnlineConversations, swapConversationToOnline, addMessageToConversation, swapConversationToOffline, addConversationToOnlines } from "../onilne-conversations/online-conversations.actions";
import { setSelectedConversation } from "../selected-conversation/selected-conversation.actions";
import { setUsersSearchResult } from "../users-search-result/users-search-result.actions";
import WEBSOCKET_ACTION_TYPES from "./websocket.types";

export const websocketMiddleware = (store) => (next) => (action) => {
    let socket = store.getState().socket;
    switch (action.type) {
        case WEBSOCKET_ACTION_TYPES.WS_CONNECT:
            if(socket)
                socket.close();
            socket = new WebSocket('ws://localhost:4040');
            console.log("new socket created", socket);
            socket.onmessage = (event) => {
                const msg = JSON.parse(event.data);

                switch (msg.type) {
                    case "online-users":
                        store.dispatch(setOnlineConversations(msg.data));
                        break;
                    case "notify-connection":
                        store.dispatch(swapConversationToOnline(msg.data));
                        break;
                    case "notify-disconnection":
                        store.dispatch(swapConversationToOffline(msg.data));
                        break;
                    case "full-conversation":
                        store.dispatch(setSelectedConversation(msg.data));
                        break;
                    case "recieve-message":
                        store.dispatch(addMessageToConversation(msg.data));
                        break;
                    case "search-results":
                        store.dispatch(setUsersSearchResult(msg.data));
                        break;
                    case "new-conversation":
                        console.log("new convo recieved in websocket middleware", msg.data);
                        store.dispatch(addConversationToOnlines(msg.data));
                        break;
                        
                    default:
                        break;
                }
            }
            action.payload = socket;
            break;
        case WEBSOCKET_ACTION_TYPES.WS_DISSCONNECT:
            if(socket){
                console.log("closing socket in middleware");
                socket.close();
            }
            break;
        default:
            break;
    }
    next(action);
}