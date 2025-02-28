import React from "react";
import ProfileImage from "../../components/ProfileImage";

const ActiveFriend = () => {
  return (
    <div className="active-friend">
      <div className="image-active-icon">
        <div className="image">
          <ProfileImage />
          <div className="active-icon"></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveFriend;
