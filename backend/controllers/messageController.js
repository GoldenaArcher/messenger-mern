const { formidable } = require("formidable");

const Message = require("../models/messageModel");
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
      $and: [
        { $or: [{ sender }, { sender: receiver }] },
        { $or: [{ receiver: sender }, { receiver }] },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messageList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
