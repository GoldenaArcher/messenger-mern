import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import ProfileImage from "../../components/ProfileImage";

import { trimMessage } from "../../utils/messageUtils";
import { getRenderedFileSummary } from "../../utils/fileUtils";

dayjs.extend(relativeTime);

const Friend = ({
  info: { image, username },
  lastMsg,
  userId,
  currentFriend,
}) => {
  const getMessageSender = () => {
    if (!lastMsg) return;

    if (lastMsg.sender === userId) {
      return <span>You</span>;
    }

    return <span>{currentFriend?.username}</span>;
  };

  const getLastSendContext = () => {
    if (!lastMsg) return;

    if (lastMsg.message) {
      return <span>: {trimMessage(lastMsg.message)}</span>;
    }

    return (
      <span>": " {getRenderedFileSummary(lastMsg.file, lastMsg.fileType)}</span>
    );
  };

  const getLastUpdatedTime = () => {
    if (!lastMsg) return;

    return <span>{dayjs(lastMsg.createdAt).startOf("minute").fromNow()}</span>;
  };

  const getNewMessageIcon = () => {
    if (!lastMsg || lastMsg.sender === userId || lastMsg.status === "read")
      return;

    return (
      <div className="seen-unseen-icon">
        <div className="seen-icon"></div>
      </div>
    );
  };

  return (
    <div className="friend">
      <div className="friend-image">
        <ProfileImage src={image} />
      </div>

      <div className="friend-name-seen">
        <div className="friend-name">
          <h4>{username}</h4>
          <div className="msg-time">
            {getMessageSender()}
            {getLastSendContext()}
            {getLastUpdatedTime()}
            {getNewMessageIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friend;
