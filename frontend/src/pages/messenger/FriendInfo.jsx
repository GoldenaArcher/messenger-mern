import React from "react";
import { FaCaretSquareDown } from "react-icons/fa";

import ProfileImage from "../../components/ProfileImage";

const FriendInfo = ({ currentFriend }) => {
  return (
    <div className="friend-info">
      <input type="checkbox" id="gallery" />
      <div className="image-name">
        <ProfileImage src={currentFriend.image} />
        <div className="active-user">Active</div>

        <div className="name">
          <h4>{currentFriend.username}</h4>
        </div>
      </div>

      <div className="others">
        <div className="custom-chat">
          <h3>Coustomise Chat </h3>
          <FaCaretSquareDown />
        </div>

        <div className="privacy">
          <h3>Privacy and Support </h3>
          <FaCaretSquareDown />
        </div>

        <div className="media">
          <h3>Shared Media </h3>
          <label htmlFor="gallery">
            <FaCaretSquareDown />
          </label>
        </div>
      </div>

      <div className="gallery">
        <img src="/image" alt="gallery-img" />
        <img src="/image" alt="gallery-img" />
        <img src="/image" alt="gallery-img" />
        <img src="/image" alt="gallery-img" />
      </div>
    </div>
  );
};

export default FriendInfo;
