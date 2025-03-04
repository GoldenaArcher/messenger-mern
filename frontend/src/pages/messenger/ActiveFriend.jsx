import React from "react";
import ProfileImage from "../../components/ProfileImage";

const ActiveFriend = ({ setCurrentFriend, currentFriend }) => {
  return (
    <div
      className="active-friend"
      onClick={() =>
        setCurrentFriend({ ...currentFriend, _id: currentFriend.id })
      }
    >
      <div className="image-active-icon">
        <div className="image">
          <ProfileImage src={currentFriend.image} isActive={true} />
        </div>
      </div>
    </div>
  );
};

export default ActiveFriend;
