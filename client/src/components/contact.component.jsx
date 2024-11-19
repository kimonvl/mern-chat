import { useContext, useEffect, useRef } from "react";
import Avatar from "./avatar.component";
import { ConversationContext } from "../context/ConversationContext.context";
import { WebSocketContext } from "../context/WebsocketContext.context";


const Contact = ({online, conv}) => {
    const {setSelectedConversation} = useContext(ConversationContext);
    const {socket} = useContext(WebSocketContext);
    const socketRef = useRef(socket);
    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    const requestConversation = () => {
        if(socketRef.current.readyState == 1){
            console.log("requesting conversation", conv);
            socketRef.current.send(JSON.stringify({type: "request-conversation", data: {convId: conv.convId}}));
        }
    }
    
    return (
        <div onClick={requestConversation} className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer "}>
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={conv.convName}/>
                <span className="text-gray-800">{conv.convName}</span>
            </div>
        </div>
    );
}

export default Contact;