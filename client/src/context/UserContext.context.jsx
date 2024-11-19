import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
    contextUsername: '',
    setContextUsername: () => null,
    contextUserId: '',
    setContextUserId: () => null
})

export const UserContextProvider = ({children}) => {
    const [contextUsername, setContextUsername] = useState('');
    const [contextUserId, setContextUserId] = useState('');

    useEffect(() =>{
        const func = async () =>{
            const {data} = await axios.get("/profile");
            setContextUserId(data.userId);
            setContextUsername(data.username);
        }
        if(document.cookie.split('; ').some((cookie) => cookie.startsWith('token='))){
            func();
        }
        
    }, [])

    const value = {contextUsername, setContextUsername, contextUserId, setContextUserId};
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
}