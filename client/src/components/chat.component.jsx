
import { useContext, useRef, useState, useEffect } from "react";
import ContactsSection from "./constacts-section.component";
import { ConversationContext } from "../context/ConversationContext.context";
import { WebSocketContext } from "../context/WebsocketContext.context";
import { UserContext } from "../context/UserContext.context";
import MessageSentBubble from "./message-sent-bubble.component";
import MessageReceivedBubble from "./message-recieved-bubble.component";

const Chat = () => {
    const {contextUserId} = useContext(UserContext);
    const {selectedConversation} = useContext(ConversationContext);
    console.log("chat selected conv",selectedConversation);
    const {socket} = useContext(WebSocketContext);
    const socketRef = useRef(socket);
    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    const [messageToSend, setMessageToSend] = useState('');

    const changeMessageToSendHandler = (ev) => {
        if(ev.target.value){
            setMessageToSend(ev.target.value);
        }
    };

    const sendMessage = () => {
        if(socketRef.current.readyState == 1 && messageToSend)
        {
            socketRef.current.send(JSON.stringify({type: "send-message", data: {convId: selectedConversation.convId, text: messageToSend}}));
        }
    };

    return (
        <div className="flex h-screen">
            <ContactsSection></ContactsSection>
            <div className="flex flex-col bg-blue-100 w-3/4 p-2">
                <div>{selectedConversation.convName}</div>
                <div className="flex-grow overflow-y-auto p-2">
                    {
                        selectedConversation.messages && selectedConversation.messages.map((message) => {
                            const sender = selectedConversation.participants.find((participant) => {return participant.userId == message.senderId;});
                            console.log("message : ", message);
                            if(message.senderId == contextUserId) {
                                return (<MessageSentBubble text={message.text} timestamp={message.timestamp}></MessageSentBubble>);
                            }else{
                                return (<MessageReceivedBubble sender={sender.username} text={message.text} timestamp={message.timestamp}></MessageReceivedBubble>);
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