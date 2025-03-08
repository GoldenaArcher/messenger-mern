const { formidable } = require("formidable");
const mongoose = require("mongoose");

const { Message, allowedStatuses } = require("../models/messageModel");
const { extractFields } = require("../utils/formidableUtils");
const { uploadDir } = require("../middlewares/uploadMiddleware");

module.exports.postMessage = async (req, res) => {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
    multiples: false,
    filter: ({ mimetype }) => {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "video/mp4",
        "video/quicktime",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(mimetype);
    },
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: err.message,
      });
    }

    try {
      const { sender, receiver, message } = extractFields(fields);
      const { file } = extractFields(files);
      let fileUrl = null;
      let fileType = null;

      if (file) {
        fileUrl = `/uploads/${file.newFilename}`;
        const mimeType = file.mimetype;

        fileType = mimeType.includes("image")
          ? "image"
          : mimeType.includes("video")
          ? "video"
          : mimeType.includes("pdf")
          ? "document"
          : mimeType.includes("msword") || mimeType.includes("officedocument")
          ? "document"
          : "other";
      }

      const newMessage = await Message.create({
        sender,
        receiver,
        message: message || "",
        file: fileUrl,
        fileType,
      });

      res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};

module.exports.getMessages = async (req, res) => {
  const { sender, receiver } = req.query;

  if (!sender || !receiver) {
    return res.status(400).json({
      success: false,
      message: "Sender and/or Receiver is not provided.",
    });
  }

  try {
    const messageList = await Message.find({
      $or: [
        {
          $and: [{ sender: { $eq: sender } }, { receiver: { $eq: receiver } }],
        },
        {
          $and: [{ sender: { $eq: receiver } }, { receiver: { $eq: sender } }],
        },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messageList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports.getLastMessages = async (req, res) => {
  try {
    const { currentUser, friends } = req.query;

    const userId = currentUser || req.user.id;

    if (!userId || !friends) {
      return res
        .status(400)
        .json({ success: false, message: "Missing query parameters." });
    }

    const friendList = Array.isArray(friends) ? friends : friends.split(",");

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const friendObjectIds = friendList.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userObjectId, receiver: { $in: friendObjectIds } },
            { receiver: userObjectId, sender: { $in: friendObjectIds } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            user1: { $toString: { $min: ["$sender", "$receiver"] } },
            user2: { $toString: { $max: ["$sender", "$receiver"] } },
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$lastMessage" } },
    ]);

    res.status(200).json({ success: true, data: lastMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid message id." });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    res.json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports.updateMessagesStatus = async (req, res) => {
  try {
    const { messageIds, status } = req.body;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid message IDs provided.",
      });
    }

    if (!["delivered", "read"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const updatedMessages = await Message.find({ _id: { $in: messageIds } });

    if (!updatedMessages.length) {
      return res.status(404).json({
        success: false,
        message: "No matching messages found.",
      });
    }

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { status } }
    );

    updatedMessages.forEach((msg) => (msg.status = status));

    res.json({
      success: true,
      message: `${updatedMessages.length} messages updated successfully.`,
      data: updatedMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
