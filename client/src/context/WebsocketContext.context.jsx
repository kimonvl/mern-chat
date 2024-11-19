import { useState, useEffect, createContext, useContext, useRef } from "react";
import _ from 'lodash';
import { ConversationContext } from "./ConversationContext.context";
import { UserContext } from "./UserContext.context";

export const WebSocketContext = createContext({
    socket: null,
    setSocket: () => null,
    usersSearchResult: [],
    setUsersSearchResults: () => null,
    isLoggedIn: false,
})

export const WebSocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [usersSearchResult, setUsersSearchResults] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const {setOnlineConversations, onlineConversations, selectedConversation, setSelectedConversation} = useContext(ConversationContext);

     // Ref to keep track of the latest onlineConversations
    const onlineConversationsRef = useRef(onlineConversations);

     useEffect(() => {
         // Keep ref updated whenever onlineConversations changes
         onlineConversationsRef.current = onlineConversations;
     }, [onlineConversations]);

     const selectedConversationRef = useRef(selectedConversation);

     useEffect(() => {
         // Keep ref updated whenever onlineConversations changes
         selectedConversationRef.current = selectedConversation;
     }, [selectedConversation]);

    useEffect(() =>{
        if(document.cookie.split('; ').some((cookie) => cookie.startsWith('token='))) {
            const soc = new WebSocket('ws://localhost:4040')
            soc.addEventListener('message', handleMessage);
            setSocket(soc);
            console.log("socket", soc);
        }
    }, [isLoggedIn]);

    const handleMessage = (ev) => {
        const msg = JSON.parse(ev.data);
        switch (msg.type) {
            case "online-users":
                handleOnlineUsers(msg.data);
                break;
            case "search-results":
                handleSearchResults(msg.data);
                break;
            case "new-conversation":
                handleNewConversation(msg.data);
                break;
            case "notify-connection":
                handleNotifyConnection(msg.data);
                break;
            case "notify-disconnection":
                handleNotifyDisconnection(msg.data);
                break;
            case "recieve-message":
                handleRecieveMessage(msg.data);
                break;
            case "full-conversation":
                handleFullConversation(msg.data);
                break;
            default:
                break;
        }
    }

    const handleSearchResults = (data) => {
        setUsersSearchResults(data);
    }

    const handleOnlineUsers = (data) => {
        data.online.forEach((convo) => {
            const name = convo.participants.reduce((accumulator, participant) => {
                return accumulator ? `${accumulator}, ${participant.username}` : participant.username;
              }, ""); 
            convo.convName = name;
        });
        data.offline.forEach((convo) => {
            const name = convo.participants.reduce((accumulator, participant) => {
                return accumulator ? `${accumulator}, ${participant.username}` : participant.username;
              }, ""); 
            convo.convName = name;
        });
        setOnlineConversations(data);
    }

    const handleNewConversation = (data) => {

        console.log(data);
    }

    const handleNotifyConnection = (data) => {
        const currentOnlineConversations = onlineConversationsRef.current;
        let convosToSwap = []
        const newOfflineConvos = currentOnlineConversations.offline.filter((offlineConv) => {
            const foundParticipant = offlineConv.participants.find((participant) => {return participant.userId.toString() == data;})
            if(foundParticipant) {
                convosToSwap.push(offlineConv);
                return false;
            }
            return true;
        });
        const newOnlineConvos = [...currentOnlineConversations.online, ...convosToSwap];
        
        setOnlineConversations({online: newOnlineConvos, offline: newOfflineConvos});
    }

    const handleNotifyDisconnection = (data) => {
        const currentOnlineConversations = onlineConversationsRef.current;
        let convosToSwap = []
        const newOnlineConvos = currentOnlineConversations.online.filter((onlineConv) => {
            const foundParticipant = onlineConv.participants.find((participant) => {return participant.userId.toString() == data;})
            if(foundParticipant) {
                convosToSwap.push(onlineConv);
                return false;
            }
            return true;
        });
        const newOfflineConvos = [...currentOnlineConversations.offline, ...convosToSwap];
        
        setOnlineConversations({online: newOnlineConvos, offline: newOfflineConvos});
    }

    const handleRecieveMessage = (data) =>{
        console.log("message recieved: ", data);
        const currentSelectedConversation = selectedConversationRef.current;
        console.log("message recieved slected conv", currentSelectedConversation);
        if(currentSelectedConversation.convId == data.conversationId){
            const newSelectedconv = {...currentSelectedConversation, messages: [...currentSelectedConversation.messages, data]};
            setSelectedConversation(newSelectedconv);
        }
    }

    const handleFullConversation = (data) => {
        const currentOnlineConversations = onlineConversationsRef.current;
        //const name = currentOnlineConversations
        console.log("full data", data);
        if(data.hasOwnProperty("messages"))
        {
            const foundOnline = currentOnlineConversations.online.find((conv) => {return conv.convId == data.messages[0].conversationId});
            const foundOffline = currentOnlineConversations.offline.find((conv) => {return conv.convId == data.messages[0].conversationId})
            if(foundOnline){
                const newSelectedConv = {...foundOnline, messages: data.messages};
                setSelectedConversation(newSelectedConv);
            }else if(foundOffline){
                const newSelectedConv = {...foundOffline, messages: data.messages};
                setSelectedConversation(newSelectedConv);
            }else {
                console.log("cant find conversation");
            }
        }else {
            const foundOnline = currentOnlineConversations.online.find((conv) => {return conv.convId == data.convId});
            const foundOffline = currentOnlineConversations.offline.find((conv) => {return conv.convId == data.convId})
            if(foundOnline){
                const newSelectedConv = {...foundOnline, messages: []};
                setSelectedConversation(newSelectedConv);
            }else if(foundOffline){
                const newSelectedConv = {...foundOffline, messages: []};
                setSelectedConversation(newSelectedConv);
            }else {
                console.log("cant find conversation");
            }
        }
    }

    const value = {socket, usersSearchResult, setIsLoggedIn, setSocket};
    return (<WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>);
}