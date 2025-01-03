import { useContext, useState, useRef, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import SearchedUser from "./searched-user.component";
import Contact from "./contact.component";
import axios from "axios";
import { selectOnlineConversations } from "../store/onilne-conversations/online-conversations.selectors";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../store/user/user.selectors";
import { setUserId, setUsername } from "../store/user/user.actions";
import React from "react";
import { setSelectedConversation } from "../store/selected-conversation/selected-conversation.actions";
import { selectSocket } from "../store/websocket/websocket.selectors";
import { wsDissconnect } from "../store/websocket/websocket.actions";
import { selectUsersSearchResult } from "../store/users-search-result/users-search-result.selectors";

const ContactsSection = () => {
    const usersSearchResult = useSelector(selectUsersSearchResult);
    const socket = useSelector(selectSocket);
    const socketRef = useRef(socket);
    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    const onlineConversations = useSelector(selectOnlineConversations);
    const contextUserId = useSelector(selectUserId);
    const dispatch = useDispatch();

    const [searchFieldValue, setSearchFieldValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    // Ref to the dropdown element to detect clicks outside
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Event listener for detecting clicks outside
        const handleClickOutside = (event) => {
          // @ts-ignore
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
          }
        };
    
        // Attach event listener to the document
        document.addEventListener("mousedown", handleClickOutside);
    
        // Cleanup the event listener on component unmount
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const changeSearcFieldhValue = (ev) => {
        setSearchFieldValue(ev.target.value);
    }

    const searchUsername = () => {
        if(!searchFieldValue)
            return;

        const msg = {type: "search-username", data: searchFieldValue};
        // @ts-ignore
        socket.send(JSON.stringify(msg));
        setIsDropdownOpen(true);
    }

    const logout = async () => {
        await axios.post('logout');
        dispatch(setUsername(null));
        dispatch(setUserId(null));
        dispatch(setSelectedConversation({}));
        localStorage.clear();
        dispatch(wsDissconnect());
        navigate('/');
    }

    return (
        <div className="bg-white w-1/4 flex flex-col items-center p-2 relative">
            {/* Search Input and Button (Centered) */}
            <div className="flex gap-2 p-1 w-full">
                <input 
                className="bg-white flex-grow border p-2 rounded-sm" 
                type="text" 
                placeholder="Search username" 
                onChange={changeSearcFieldhValue} 
                value={searchFieldValue}
                />
                <button className="bg-blue-500 p-2 text-white rounded-sm" onClick={searchUsername}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>

            {/* Dropdown (Standard width, Scrollable if needed, Pushes Contacts Down) */}
            {isDropdownOpen && (
                <div ref={dropdownRef} className="dropdown bg-blue-500 w-[90%] max-w-[300px] h-[200px] flex items-center justify-center text-white text-center mx-auto absolute top-[55px] left-[50%] transform -translate-x-1/2 z-10 overflow-y-auto">
                {
                    usersSearchResult.map((user) => {
                    // @ts-ignore
                    if(user.userId !== contextUserId)
                        // @ts-ignore
                        return (<SearchedUser key={user.userId} user={user} socket={socket}></SearchedUser>);
                    })
                }
                </div>
            )}

            {/* Contacts (Aligned Left, Push Down when Dropdown is Open) */}
            <div className={`contacts w-full ${isDropdownOpen ? 'mt-[250px]' : ''} overflow-y-auto`}>
                {
                    onlineConversations.online && onlineConversations.online.map((conv) => {
                        return (
                        <Contact key={conv.convId} online={true} conv={conv}></Contact>
                        );
                    })
                }
                {
                    onlineConversations.offline && onlineConversations.offline.map((conv) => {
                        return (
                        <Contact key={conv.convId} online={false} conv={conv}></Contact>
                        );
                    })
                }
            </div>
            {/* Logout Button */}
            <div className="mt-auto w-full px-4 py-2">
                <button
                onClick={logout}
                className="w-full bg-red-500 text-white p-2 rounded-sm hover:bg-red-600 transition-colors duration-300"
                >
                Logout
                </button>
            </div>
        </div>
    );
}

export default ContactsSection;