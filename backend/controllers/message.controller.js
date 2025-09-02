import Conversation from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    //implement socket io

    return res.status(200).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation)
      return res.status(200).json({
        success: true,
        message: [],
      });

    await conversation.populate({
      path: "messages",
    });

    return res.status(200).json({
      success: true,
      message: conversation?.messages,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
