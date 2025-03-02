import React, { useCallback, useState } from "react";
import {
  FaFileImage,
  FaGift,
  FaHeart,
  FaPaperPlane,
  FaPlusCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { usePostMessageMutation } from "../../store/features/messageApi";

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

const SendMessage = ({ currentFriend }) => {
  const [newMessage, setNewMessage] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  const [postMessage, { isLoading, isSuccess, isError, error, data, reset }] =
    usePostMessageMutation();

  const onChangeMessage = useCallback((e) => {
    setNewMessage(e.target.value);
  }, []);

  const onSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const data = {
      sender: userInfo.id,
      receiver: currentFriend._id,
      message: newMessage,
    };
    try {
      await postMessage(data).unwrap();
    } catch (err) {
      console.error("send message failed: ", err);
    }
  };

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
          onChange={onChangeMessage}
          value={newMessage}
        />
        <div className="file hover-gift">
          <label htmlFor="emoji">
            <FaPaperPlane />
          </label>
        </div>
      </div>

      <div className="file">
        <FaHeart onClick={onSendMessage} />
      </div>

      <div className="emoji-section">
        <div className="emoji">
          {emojis.map((emoji, i) => (
            <span key={i}>{emoji}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
