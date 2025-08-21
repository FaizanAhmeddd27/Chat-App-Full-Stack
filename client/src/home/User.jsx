import React from "react";
import { useChat } from "../context/ChatProvider";
import { useSelector } from "react-redux";

const User = ({ users, onUserSelect }) => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useSelector((state) => state.socket);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    if (onUserSelect) onUserSelect(); 
  };

  return (
    <div className="mt-4">
      {users && users.length > 0 ? (
        users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          return (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 md:gap-4 p-3 rounded-xl mt-1 transition cursor-pointer ${
                selectedUser?._id === user._id ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <div className="relative avatar flex-shrink-0">
                <div className="w-12 md:w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user.avatar?.url} alt={user.name} />
                </div>
                {isOnline && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500 border-2 border-gray-900"></span>
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm md:text-base truncate">{user.name}</h3>
                <p className="text-xs md:text-sm opacity-70 truncate">{user.email}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-400 text-center p-4">No users found</p>
      )}
    </div>
  );
};

export default User;