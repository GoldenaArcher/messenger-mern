import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import RightSide from "./RightSide";
import LeftSide from "./LeftSide";

import { useFetchFriendsQuery } from "../../store/features/friendApi";

import { useSocket } from "../../context/SocketProvider";

import { trimMessage } from "../../utils/messageUtils";

const Messenger = () => {
  const { data: friendList } = useFetchFriendsQuery();

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
  }, [socket, friendList]);

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
