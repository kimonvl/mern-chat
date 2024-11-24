import { createContext, useState } from "react";
import React from "react";

export const ConversationContext = createContext({
    onLineConversations: [], // onlineConversations: {online: {convName: "convname1", convId: "convId1", participants: [{userId: "id1", username: "name1"}]}, offline: {...}}
    setOnlineConversations: () => null,
});

export const ConversationContextProvider = ({children}) => {
    const [onlineConversations, setOnlineConversations] = useState([]);

    const value = {onlineConversations, setOnlineConversations};

    return (
        <ConversationContext.Provider 
// @ts-ignore
        value={value}>{children}</ConversationContext.Provider>
    );
}