import { useContext, useEffect, useRef } from "react";
import Avatar from "./avatar.component";
import { WebSocketContext } from "../context/WebsocketContext.context";


const Contact = ({online, conv}) => {
    const {socket} = useContext(WebSocketContext);
    const socketRef = useRef(socket);
    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    const requestConversation = () => {
        if(socketRef.current.readyState == 1){
            socketRef.current.send(JSON.stringify({type: "request-conversation", data: {convId: conv.convId}}));
        }
    }
    
    return (
        <div onClick={requestConversation} className="border-b border-gray-100 flex items-center gap-2 cursor-pointer relative">
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={conv.convName} />
                <span className="text-gray-800">{conv.convName}</span>
            </div>

            {/* Unread message count */}
            {
                conv.unreadMessages > 0 ?  (
                    <div className="absolute  right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unreadMessages}
                    </div>
                ) : (<div/>)
            }
        </div>
    );
}

export default Contact;