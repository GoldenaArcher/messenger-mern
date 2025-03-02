import React from "react";
import ProfileImage from "../../components/ProfileImage";

const Friends = ({ info: { image, username } }) => {
  return (
    <div className="friend">
      <div className="friend-image">
        <ProfileImage src={image} />
      </div>

      <div className="friend-name-seen">
        <div className="friend-name">
          <h4>{username}</h4>
        </div>
      </div>
    </div>
  );
};

export default Friends;
