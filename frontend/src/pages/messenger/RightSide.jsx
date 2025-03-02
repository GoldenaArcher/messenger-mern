import React from "react";
import { FaPhoneAlt, FaVideo, FaRocketchat } from "react-icons/fa";
import ProfileImage from "../../components/ProfileImage";
import Message from "./Message";
import SendMessage from "./SendMessage";
import FriendInfo from "./FriendInfo";

const RightSide = ({ currentFriend }) => {
  return (
    <div className="col-9">
      <div className="right-side">
        <input type="checkbox" name="dot" id="dot" />
        <div className="row">
          <div className="col-8">
            <div className="message-send-show">
              <div className="header">
                <div className="image-name">
                  <ProfileImage
                    name={currentFriend.username}
                    src={currentFriend.image}
                  />
                </div>

                <div className="icons">
                  <div className="icon">
                    <FaPhoneAlt />
                  </div>

                  <div className="icon">
                    <FaVideo />
                  </div>

                  <div className="icon">
                    <label htmlFor="dot">
                      <FaRocketchat />
                    </label>
                  </div>
                </div>
              </div>

              <Message />
              <SendMessage currentFriend={currentFriend} />
            </div>
          </div>

          <div className="col-4">
            <FriendInfo currentFriend={currentFriend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
