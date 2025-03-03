import React, { Fragment, useEffect, useRef } from "react";
import { useFetchMessagesQuery } from "../../store/features/messageApi";
import { useSelector } from "react-redux";
import ProfileImage from "../../components/ProfileImage";
import { toReadableTime } from "../../utils/timeUtils";
import { getRenderedFile } from "../../store/utils/fileUtils";

const MyMessage = ({ message, file, fileType, updatedAt, scrollRef }) => {
  const messageBody =
    file && fileType ? getRenderedFile(file, fileType) : message;

  return (
    <div className="message-container my-message" ref={scrollRef}>
      <div className="message-wrapper">
        <div className="my-text">
          <p className="message-text">{messageBody}</p>
        </div>
        <div className="time">{toReadableTime(updatedAt)}</div>
      </div>
    </div>
  );
};

const FriendMessage = ({
  message,
  updatedAt,
  imgUrl,
  scrollRef,
  file,
  fileType,
}) => {
  const messageBody =
    file && fileType ? getRenderedFile(file, fileType) : message;

  return (
    <div className="message-container fd-message" ref={scrollRef}>
      <div className="profile">
        <ProfileImage src={imgUrl} />
      </div>

      <div className="message-wrapper">
        <div className="fd-text">
          <p className="message-text">{messageBody}</p>
        </div>
        <div className="time">{toReadableTime(updatedAt)}</div>
      </div>
    </div>
  );
};

const Message = ({ currentFriend }) => {
  const scrollRef = useRef();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: messageList } = useFetchMessagesQuery(
    currentFriend
      ? { sender: userInfo.id, receiver: currentFriend?._id }
      : undefined,
    { skip: !currentFriend }
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messageList]);

  return (
    <div className="message-show">
      {messageList &&
        messageList.map(
          (
            { _id, sender, receiver, message, updatedAt, file, fileType },
            index
          ) => {
            const isLastIndex = index === messageList.length - 1,
              hasFile = file && fileType,
              hasMessage = !!message;

            if (sender === userInfo.id && receiver === currentFriend?._id) {
              return (
                <Fragment key={_id}>
                  {hasFile && (
                    <MyMessage
                      updatedAt={updatedAt}
                      file={file}
                      fileType={fileType}
                      scrollRef={
                        index === (isLastIndex && !hasMessage)
                          ? scrollRef
                          : null
                      }
                    />
                  )}
                  {hasMessage && (
                    <MyMessage
                      message={message}
                      updatedAt={updatedAt}
                      scrollRef={isLastIndex ? scrollRef : null}
                    />
                  )}
                </Fragment>
              );
            }

            if (sender === currentFriend?._id && receiver === userInfo.id) {
              return (
                <Fragment key={_id}>
                  {hasFile && (
                    <FriendMessage
                      imgUrl={currentFriend.image}
                      updatedAt={updatedAt}
                      file={file}
                      fileType={fileType}
                      scrollRef={
                        index === (isLastIndex && !hasMessage)
                          ? scrollRef
                          : null
                      }
                    />
                  )}
                  {hasMessage && (
                    <FriendMessage
                      imgUrl={currentFriend.image}
                      message={message}
                      updatedAt={updatedAt}
                      scrollRef={isLastIndex ? scrollRef : null}
                    />
                  )}
                </Fragment>
              );
            }

            return null;
          }
        )}
    </div>
  );
};

export default Message;
