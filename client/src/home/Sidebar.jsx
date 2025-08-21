import React, { useState } from 'react';
import { IoSearchSharp } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import User from './User';
import { useAuth } from '../context/AuthProvider';
import { useChat } from '../context/ChatProvider';
import axios from 'axios';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, users, setUser } = useAuth();
  const { setSelectedUser } = useChat();
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout", {}, { withCredentials: true });
      localStorage.removeItem("selectedUser");
      localStorage.removeItem("authUser");
      setSelectedUser(null);
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed:", error);
    }
  };

  const filteredUsers = users?.filter(
    (u) =>
      u._id !== user?._id &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800 rounded-lg text-white shadow-lg"
      >
        <HiMenuAlt3 className="text-xl" />
      </button>

      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative fixed top-0 left-0 z-50
        w-80 md:w-1/4 h-screen border-r border-gray-700 text-white 
        flex flex-col bg-gradient-to-b from-gray-900 to-gray-800
        transition-transform duration-300 ease-in-out
      `}>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <HiX className="text-xl" />
        </button>

        <h1 className="text-2xl md:text-3xl mt-5 text-center font-bold tracking-wide px-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
            BuddyTalk
          </span>
        </h1>

        <div className="mt-4 mx-3 md:mx-4 bg-gray-800 rounded-xl px-3 py-2 flex items-center gap-2 shadow-md">
          <IoSearchSharp className="text-gray-400 text-lg flex-shrink-0" />
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none border-none text-gray-200 placeholder-gray-400 w-full text-sm md:text-base"
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 px-3 space-y-2 custom-scrollbar">
          <User users={filteredUsers} onUserSelect={() => setIsMobileMenuOpen(false)} />
        </div>

        <div className="border-t border-gray-700 p-4 flex items-center gap-3 bg-gray-900/70 backdrop-blur-md">
          <div className="avatar flex-shrink-0">
            <div className="w-10 rounded-full ring ring-cyan-500 ring-offset-gray-900 ring-offset-2">
              <img src={user?.avatar?.url} alt="profile" />
            </div>
          </div>
          <p className="flex-1 font-medium truncate text-sm md:text-base">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="px-3 py-2 md:px-4 text-xs md:text-sm rounded-lg font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:from-red-600 hover:to-pink-700 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
