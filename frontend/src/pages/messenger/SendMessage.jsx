import React from "react";
import {
  FaFileImage,
  FaGift,
  FaHeart,
  FaPaperPlane,
  FaPlusCircle,
} from "react-icons/fa";

const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "😝",
  "😜",
  "🧐",
  "🤓",
  "😎",
  "😕",
  "🤑",
  "🥴",
  "😱",
];

const SendMessage = () => {
  return (
    <div className="send-message-section">
      <input type="checkbox" name="emoji" id="emoji" />

      <div className="file hover-attachment">
        <div className="add-attachment">Add Attachment</div>
        <FaPlusCircle />
      </div>

      <div className="file hover-image">
        <div className="add-image">Add Image</div>
        <label htmlFor="pic">
          <FaFileImage />
        </label>
      </div>

      <div className="file hover-gift">
        <div className="add-gift">Add Gift</div>
        <FaGift />
      </div>

      <div className="message-type">
        <input
          type="text"
          name="message"
          id="message"
          placeholder="Aa"
          className="form-control"
        />
        <div className="file hover-gift">
          <label htmlFor="emoji">
            <FaPaperPlane />
          </label>
        </div>
      </div>

      <div className="file">
        <FaHeart />
      </div>

      <div className="emoji-section">
        <div className="emoji">
          {emojis.map((emoji) => (
            <span>{emoji}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
