import React from 'react';

const MessageSentBubble = ({ text, timestamp }) => {
  return (
    <div className="flex flex-col items-end mb-4">
      {/* Message Bubble */}
      <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs min-w-[140px] break-words">
        {/* Message Text */}
        <span className="text-sm">{text}</span>

        {/* Add spacing */}
        <div className="mt-1 text-right">
          <span className="text-xs text-gray-200">{new Date(timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageSentBubble;
