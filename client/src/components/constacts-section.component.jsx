import { useContext, useState } from "react";
import { WebSocketContext } from "../context/WebsocketContext.context";
import SearchedUser from "./searched-user.component";

const ContactsSection = () => {
    const {socket, usersSearchResult} = useContext(WebSocketContext);

    const [searchFieldValue, setSearchFieldValue] = useState('');

    const changeSearcFieldhValue = (ev) => {
        setSearchFieldValue(ev.target.value);
    }

    const searchUsername = () => {
        if(!searchFieldValue)
            return;

        const msg = {type: "search-username", data: searchFieldValue};
        socket.send(JSON.stringify(msg));
    }

    return (
        <div className="bg-white w-1/4 flex flex-col items-center p-2 relative">
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

            {true && (
                <div className="bg-blue-500 w-[95%] h-[200px] flex items-center justify-center text-white text-center mx-auto absolute top-[55px] left-[50%] transform -translate-x-1/2 z-5">
                    {
                        usersSearchResult.map((user) => {
                            return (<SearchedUser user={user} socket={socket}></SearchedUser>);
                        })
                    }
                </div>
            )}

            
        </div>
    );
}

export default ContactsSection;