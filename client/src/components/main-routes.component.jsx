import { useEffect } from "react";
import AuthenticationPage from "./authentiction-page.component";
import Chat from "./chat.component";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {setUserId, setUsername} from "../store/user/user.actions.js";
import React from "react";
import { selectUsername } from "../store/user/user.selectors.js";

const MainRoutes = () => {
    const dispatch = useDispatch();
    const username = useSelector(selectUsername);

    useEffect(() =>{
        const func = async () =>{
            const {data} = await axios.get("/profile");
            dispatch(setUserId(data.userId));
            dispatch(setUsername(data.username));
        }
        if(document.cookie.split('; ').some((cookie) => cookie.startsWith('token='))){
            func();
        }
        
    }, [])

    if(username)
        return (
            <Chat />
        );

    return (
        <AuthenticationPage></AuthenticationPage>
    );
}

export default MainRoutes;