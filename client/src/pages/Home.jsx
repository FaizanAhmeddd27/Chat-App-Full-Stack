import React, { useEffect } from "react";
import Sidebar from "../home/Sidebar.jsx";
import Messages from "../home/Messages.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket, setOnlineUsers } from "../../redux/socket/socket.slice.js";
import { useMessages } from "../context/MessageProvider.jsx";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const { setMessages } = useMessages();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(initializeSocket(user._id));
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("newMessage");
    };
  }, [socket, dispatch, setMessages]);

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden">
      <Sidebar />
      <Messages />
    </div>
  );
};

export default Home;