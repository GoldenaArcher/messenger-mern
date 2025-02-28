import React from "react";
import { FaPhoneAlt, FaVideo, FaRocketchat } from "react-icons/fa";
import ProfileImage from "../../components/ProfileImage";
import Message from "./Message";
import SendMessage from "./SendMessage";
import FriendInfo from "./FriendInfo";

const RightSide = () => {
  return (
    <div className="col-9">
      <div className="right-side">
        <div className="row">
          <div className="col-8">
            <div className="message-send-show">
              <div className="header">
                <div className="image-name">
                  <ProfileImage name="Test" />
                </div>

                <div className="icons">
                  <div className="icon">
                    <FaPhoneAlt />
                  </div>

                  <div className="icon">
                    <FaVideo />
                  </div>

                  <div className="icon">
                    <FaRocketchat />
                  </div>
                </div>
              </div>

              <Message />
              <SendMessage />
            </div>
          </div>

          <div className="col-4">
            <FriendInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
