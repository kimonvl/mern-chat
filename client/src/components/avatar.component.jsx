import React from "react";

const Avatar = ({username, online}) => {
    return (
        <div className={"w-8 h-8 relative rounded-full flex items-center bg-red-100"}>
            <div className="text-center w-full opacity-70">{username[0]}</div>
            {online && (
                <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
            )}
            {!online && (
                <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
            )}
        </div>
    );
}

export default Avatar;