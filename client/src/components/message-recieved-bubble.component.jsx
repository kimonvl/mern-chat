import React from 'react';

const MessageReceivedBubble = ({ sender, text, timestamp }) => {
  return (
    <div className="flex flex-col items-start mb-4">
      {/* Sender Username */}
      <span className="text-sm text-gray-500 mb-1">{sender}</span>

      {/* Message Bubble */}
      <div className="bg-gray-200 p-2 rounded-lg max-w-xs min-w-[140px] break-words">
        {/* Message Text */}
        <span className="text-sm text-black">{text}</span>

        {/* Add spacing */}
        <div className="mt-1 text-right">
          <span className="text-xs text-gray-500">{new Date(timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageReceivedBubble;
