import React from "react";
import Message from "./Message";
import TypeSend from "./TypeSend";
import { useChat } from "../context/ChatProvider";
import { useSelector } from "react-redux";
import { useMessages } from "../context/MessageProvider";
import UpdateProfile from "./UpdateProfile";

const Messages = () => {
  const { selectedUser } = useChat();
  const { onlineUsers } = useSelector((state) => state.socket);
  const { messages, loading } = useMessages();
  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  if (!selectedUser)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 p-4 text-center">
        <div>
          <p className="text-lg md:text-xl mb-2">Welcome to BuddyTalk</p>
          <p className="text-sm md:text-base">Select a user to start chatting</p>
        </div>
      </div>
    );

  return (
    <div className="flex-1 min-h-screen w-full text-white flex flex-col ml-0 md:ml-0">
      <div className="relative z-10 flex items-center justify-between border-b border-gray-700 p-3 md:p-4  backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1 ml-16 mb-3 md:mb-0 md:ml-0">
          <div className="avatar relative flex-shrink-0">
            <div className="w-10 md:w-12 rounded-full ring ring-cyan-500 ring-offset-gray-900 ring-offset-2">
              <img src={selectedUser.avatar?.url} alt="profile" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base md:text-lg font-semibold truncate">{selectedUser.name}</h1>
            {isOnline ? (
              <p className="text-xs md:text-sm text-green-400">Online</p>
            ) : (
              <p className="text-xs md:text-sm text-gray-400">Offline</p>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-3">
          <UpdateProfile />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative z-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : (
          <Message messages={messages} selectedUser={selectedUser} />
        )}
      </div>

      <div className="relative z-10">
        <TypeSend />
      </div>
    </div>
  );
};

export default Messages;