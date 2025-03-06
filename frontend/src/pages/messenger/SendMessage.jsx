import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaFileImage,
  FaGift,
  FaHeart,
  FaPaperPlane,
  FaPlusCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import useSound from "use-sound";

import { useSocket } from "../../context/SocketProvider";

import { usePostMessageMutation } from "../../store/features/messageApi";

import { useTyping } from "../../hooks/useTyping";

import sendingSound from "../../assets/sounds/sending.mp3";

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
  const messageRef = useRef();
  const cursorPositionRef = useRef(0);

  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  const { socket } = useSocket();

  const [postMessage] = usePostMessageMutation();

  const { handleTyping } = useTyping(currentFriend?._id);

  const [play] = useSound(sendingSound);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.selectionStart = cursorPositionRef.current;
      messageRef.current.selectionEnd = cursorPositionRef.current;
    }
  }, [newMessage]);

  const onChangeMessage = useCallback(
    (e) => {
      const input = e.target;
      const { selectionStart } = input;

      setNewMessage(e.target.value);
      handleTyping();

      cursorPositionRef.current = selectionStart;
    },
    [handleTyping]
  );

  const onChangeFile = useCallback((e) => {
    if (e.target.files.length !== 0) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const onClickEmoji = useCallback(
    (e) => {
      if (!messageRef.current) return;

      const input = messageRef.current;

      const start = input.selectionStart,
        end = input.selectionEnd,
        emoji = e.target.innerText;

      setNewMessage(
        (prev) => prev.substring(0, start) + emoji + prev.substring(end)
      );

      cursorPositionRef.current = start + emoji.length;
    },
    [messageRef]
  );

  const onSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append("sender", userInfo.id);
    formData.append("receiver", currentFriend._id);
    if (newMessage.trim()) formData.append("message", newMessage);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      play();
      const res = await postMessage(formData).unwrap();
      socket.emit("sendMessage", res);

      setNewMessage("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Send message failed: ", err);
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
        <input
          type="file"
          name="pic"
          id="pic"
          className="form-control"
          onChange={onChangeFile}
        />
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
          ref={messageRef}
          autoComplete="off"
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
            <span key={i} onClick={onClickEmoji}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
