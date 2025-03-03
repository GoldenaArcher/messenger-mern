const { model, Schema, Types } = require("mongoose");

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
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
