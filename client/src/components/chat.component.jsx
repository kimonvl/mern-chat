import { useRef, useState, useEffect } from "react";
import ContactsSection from "./contacts-section.component";
import MessageSentBubble from "./message-sent-bubble.component";
import MessageReceivedBubble from "./message-recieved-bubble.component";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../store/user/user.selectors";
import { selectSelectedConversation } from "../store/selected-conversation/selected-conversation.selectors";
import { setSelectedConversation } from "../store/selected-conversation/selected-conversation.actions";
import { selectIsLoggedIn, selectSocket } from "../store/websocket/websocket.selectors";
import { wsConnect } from "../store/websocket/websocket.actions";
const Chat = () => {
    const contextUserId = useSelector(selectUserId);
    const dispatch = useDispatch();

    useEffect(() =>{
        if(document.cookie.split('; ').some((cookie) => cookie.startsWith('token='))) {
            dispatch(wsConnect());
        }
    }, []);

    useEffect(() => {
        const storedSelectedConversation = localStorage.getItem('selected-conversation');
        if(storedSelectedConversation){
            const obj = JSON.parse(storedSelectedConversation);
            // @ts-ignore
            dispatch(setSelectedConversation(obj));
        }
    }, []);
    
    const selectedConversation = useSelector(selectSelectedConversation);
    

    const socket = useSelector(selectSocket);
    const socketRef = useRef(socket);
    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    const [messageToSend, setMessageToSend] = useState('');

    const changeMessageToSendHandler = (ev) => {
        setMessageToSend(ev.target.value);
    };

    const sendMessage = () => {
        // @ts-ignore
        if(socketRef.current.readyState == 1 && messageToSend)
        {
            // @ts-ignore
            socketRef.current.send(JSON.stringify({type: "send-message", data: {convId: selectedConversation.convId, text: messageToSend}}));
        }
    };

    const divRef = useRef(null);

    const handleClickOutside = (event) => {
        // @ts-ignore
        if (divRef.current && !divRef.current.contains(event.target)) {
            console.log('Clicked outside the div!');
            // Add your logic here (e.g., close dropdown, modal, etc.)
            // @ts-ignore
            dispatch(setSelectedConversation({}));
        }
    };

    useEffect(() => {
        // Attach event listener on mount
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup the event listener on unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen">
            <ContactsSection></ContactsSection>
            <div ref={divRef} className="flex flex-col bg-blue-100 w-3/4 p-2">
                <div>{selectedConversation.convName}</div>
                <div className="flex-grow overflow-y-auto p-2">
                    {
                        selectedConversation.messages && selectedConversation.messages.map((message) => {
                            const sender = selectedConversation.participants.find((participant) => {return participant.userId == message.senderId;});
                            if(message.senderId == contextUserId) {
                                return (<MessageSentBubble key={message._id} text={message.text} timestamp={message.timestamp}></MessageSentBubble>);
                            }else{
                                return (<MessageReceivedBubble key={message._id} sender={sender.username} text={message.text} timestamp={message.timestamp}></MessageReceivedBubble>);
                            }
                        })
                    }
                </div>
                <div className="flex gap-2">
                    <input value={messageToSend} onChange={changeMessageToSendHandler} className="bg-white flex-grow border p-2 rounded-sm" type="text" placeholder="Type your message here"></input>
                    <button onClick={sendMessage} className="bg-blue-500 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;