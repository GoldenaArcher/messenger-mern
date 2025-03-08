const { model, Schema, Types } = require("mongoose");

const allowedStatuses = ["sent", "delivered", "read"];

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "user", required: true },
    receiver: { type: Types.ObjectId, ref: "user", required: true },
    message: { type: String, default: "" },
    file: { type: String, default: null },
    fileType: {
      type: String,
      enum: ["image", "video", "document", "other", null],
      default: null,
    },
    status: {
      type: String,
      enum: allowedStatuses,
      default: "sent",
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

module.exports = { Message, allowedStatuses };
