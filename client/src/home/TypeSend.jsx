import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useChat } from "../context/ChatProvider";
import { useMessages } from "../context/MessageProvider";
import toast from "react-hot-toast";

const TypeSend = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { selectedUser } = useChat();
  const { setMessages } = useMessages();

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const { data } = await axios.post(
        "/api/message/send",
        {
          receiverId: selectedUser._id,
          message: newMessage,
        },
        { withCredentials: true }
      );


      setNewMessage("");
    } catch (err) {
      toast.error("Error sending message:", err.response?.data || err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 md:p-4   backdrop-blur-sm">
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-4 py-2 md:py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base placeholder-gray-400"
      />
      <button
        onClick={handleSend}
        disabled={!newMessage.trim()}
        className="p-2 md:p-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md flex-shrink-0"
      >
        <IoMdSend className="text-white text-lg md:text-xl" />
      </button>
    </div>
  );
};

export default TypeSend;