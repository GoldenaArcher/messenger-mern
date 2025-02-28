import React from "react";
import { FaCaretSquareDown } from "react-icons/fa";
import ProfileImage from "../../components/ProfileImage";

const FriendInfo = () => {
  return (
    <div className="friend-info">
      <input type="checkbox" id="gallery" />
      <div className="image-name">
        <ProfileImage />
        <div className="active-user">Active</div>

        <div className="name">
          <h4>Kazi Ariyan </h4>
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
            {" "}
            <FaCaretSquareDown />{" "}
          </label>
        </div>
      </div>

      <div className="gallery">
        <img src="/image/20003ariyan.jpg" alt="gallery-img" />
        <img src="/image/20003ariyan.jpg" alt="gallery-img" />
        <img src="/image/20003ariyan.jpg" alt="gallery-img" />
        <img src="/image/20003ariyan.jpg" alt="gallery-img" />
      </div>
    </div>
  );
};

export default FriendInfo;
