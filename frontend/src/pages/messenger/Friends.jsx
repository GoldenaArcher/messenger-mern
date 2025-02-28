import React from "react";
import ProfileImage from "../../components/ProfileImage";

const Friends = () => {
  return (
    <div className="friend">
      <div className="friend-image">
        <ProfileImage />
      </div>

      <div className="friend-name-seen">
        <div className="friend-name">
          <h4>test</h4>
        </div>
      </div>
    </div>
  );
};

export default Friends;
