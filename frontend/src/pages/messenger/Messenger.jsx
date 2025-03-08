import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import RightSide from "./RightSide";
import LeftSide from "./LeftSide";

import { useFetchFriendsQuery } from "../../store/features/friendApi";

import { useSocket } from "../../context/SocketProvider";

import { trimMessage } from "../../utils/messageUtils";
import { messageApi } from "../../store/features/messageApi";
import useMessageStatus from "../../hooks/useMessageStatus";

const Messenger = () => {
  const dispatch = useDispatch();
  const { data: friendList } = useFetchFriendsQuery();
  const { markAsDelivered } = useMessageStatus();

  const [currentFriend, setCurrentFriend] = useState(null);

  const { socket } = useSocket();

  useEffect(() => {
    if (friendList?.length) {
      setCurrentFriend(friendList[0]);
    }
  }, [friendList]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      dispatch(
        messageApi.util.updateQueryData(
          "fetchMessages",
          { sender: message.receiver, receiver: message.sender },
          (messageList) => {
            if (!messageList) {
              dispatch(messageApi.util.invalidateTags(["Messages"]));
              return;
            }
            messageList.push(message);
          }
        )
      );

      dispatch(
        messageApi.util.updateQueryData(
          "fetchLastFriendMessages",
          { friendList: friendList.map((friend) => friend._id) },
          (lastMessages) => {
            if (!lastMessages) {
              dispatch(
                messageApi.util.invalidateTags(["fetchLastFriendMessages"])
              );
              return;
            }
            const existingIndex = lastMessages.findIndex(
              (msg) =>
                (msg.sender === message.sender &&
                  msg.receiver === message.receiver) ||
                (msg.sender === message.receiver &&
                  msg.receiver === message.sender)
            );

            if (existingIndex !== -1) {
              lastMessages[existingIndex] = message;
            } else {
              lastMessages.push(message);
            }
          }
        )
      );

      markAsDelivered(message._id);

      const senderInfo = friendList?.find(
        (friend) => friend._id === message.sender
      );
      const senderName = senderInfo?.username ?? "Unknown User";

      let displayMessage;
      if (message.message) {
        displayMessage = `"${trimMessage(message.message)}"`;
      } else if (message.image) {
        displayMessage = "📷 Sent you an image";
      } else if (message.file) {
        displayMessage = "📎 Sent you a file";
      } else {
        displayMessage = "📩 Sent you a new message";
      }

      toast.info(`📩 ${senderName}: ${displayMessage}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, friendList, dispatch]);

  return (
    <div className="messenger">
      <div className="row">
        <LeftSide
          setCurrentFriend={setCurrentFriend}
          currentFriend={currentFriend}
        />
        {currentFriend ? (
          <RightSide currentFriend={currentFriend} />
        ) : (
          "Please select a friend."
        )}
      </div>
    </div>
  );
};

export default Messenger;
