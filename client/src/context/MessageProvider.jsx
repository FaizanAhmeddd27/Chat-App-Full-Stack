import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useChat } from "./ChatProvider";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { selectedUser } = useChat();
  const { socket } = useSelector((state) => state.socket);

  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]); 
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/message/${selectedUser._id}`, {
          withCredentials: true,
        });
        setMessages(data.messages || []);
      } catch (err) {
      toast.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]); 
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  return (
    <MessageContext.Provider value={{ messages, setMessages, loading }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
