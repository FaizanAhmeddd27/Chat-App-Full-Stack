import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import {getSocketId, io} from '../socket/socket.js'

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }

    // Create a new message linked to conversation
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id, 
    });

    await newMessage.save();

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // socket-io
    const receiverSocketId = getSocketId(receiverId);
    const senderSocketId = getSocketId(senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Convert both IDs to ObjectId to ensure type consistency
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    // Query with properly converted ObjectIds
    const messages = await Message.find({
      $or: [
        { senderId: senderObjectId, receiverId: receiverObjectId },
        { senderId: receiverObjectId, receiverId: senderObjectId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email avatar")
      .populate("receiverId", "name email avatar");

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};