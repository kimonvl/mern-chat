import { createContext, useEffect, useState } from "react";

export const ConversationContext = createContext({
    selectedConversation: {},
    setSelectedConversation: () => null,
    onLineConversations: [], // onlineConversations: {online: {convName: "convname1", convId: "convId1", participants: [{userId: "id1", username: "name1"}]}, offline: {...}}
    setOnlineConversations: () => null,
});

export const ConversationContextProvider = ({children}) => {
    const [selectedConversation, setSelectedConversation] = useState({});
    const [onlineConversations, setOnlineConversations] = useState([]);

    useEffect(() => {
        const storedSelectedConversation = localStorage.getItem('selectedConversation');
        if(storedSelectedConversation){
            const obj = JSON.parse(storedSelectedConversation);
            console.log("get selected conv from storage", storedSelectedConversation);
            setSelectedConversation(obj);
        }
    }, []);

    useEffect(() => {
        if(Object.keys(selectedConversation).length !== 0){
            console.log("save selected conv to storage", selectedConversation);
            localStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
        }
    }, [selectedConversation]);

    const value = {selectedConversation, setSelectedConversation, onlineConversations, setOnlineConversations};

    return (
        <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>
    );
}