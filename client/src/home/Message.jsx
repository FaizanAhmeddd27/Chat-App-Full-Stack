import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthProvider";

const Message = ({ messages, selectedUser }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4" role="log" aria-live="polite">
      {messages.map((msg) => {
        const senderId =
          typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
        const isMe = senderId === user._id;

        return (
          <div
            key={msg._id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            role="listitem"
          >
            <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isMe ? "order-2" : "order-1"}`}>
              {/* Sender name */}
              <div className={`text-xs md:text-sm text-gray-400 mb-1 ${isMe ? "text-right" : "text-left"}`}>
                {isMe ? "You" : selectedUser?.name || "Unknown"}
              </div>

              <div
                className={`p-3 rounded-2xl ${
                  isMe
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-sm"
                    : "bg-gray-500 text-gray-100 rounded-bl-sm"
                } shadow-md`}
                role="article"
              >
                <p className="text-sm md:text-base break-words">{msg.message}</p>
              </div>

              <div
                className={`text-xs text-gray-500 mt-1 ${
                  isMe ? "text-right" : "text-left"
                }`}
                aria-label={`Sent at ${formatTime(msg.createdAt)}`}
              >
                {formatTime(msg.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Message;