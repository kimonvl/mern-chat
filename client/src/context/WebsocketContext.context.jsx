import { useState, useEffect, createContext } from "react";

export const WebSocketContext = createContext({
    socket: null,
    setSocket: () => null,
    usersSearchResult: [],
    setUsersSearchResults: () => null
})

export const WebSocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [usersSearchResult, setUsersSearchResults] = useState([]);

    useEffect(() =>{
        const soc = new WebSocket('ws://localhost:4040')
        soc.addEventListener('message', handleMessage);
        setSocket(soc);
    }, [])

    const handleMessage = (ev) => {
        const msg = JSON.parse(ev.data);
        switch (msg.type) {
            case "online-users":
                handleOnlineUsers(msg.data);
                break;
            case "search-results":
                handleSearchResults(msg.data);
                break;
            default:
                break;
        }
    }

    const handleSearchResults = (users) => {
        setUsersSearchResults(users);
    }

    const handleOnlineUsers = (users) => {
        console.log(users);
    }

    const value = {socket, usersSearchResult};
    return (<WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>);
}