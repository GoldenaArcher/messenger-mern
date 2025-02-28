import React from "react";
import { FaEdit, FaEllipsisH, FaSistrix } from "react-icons/fa";

import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import ProfileImage from "../../components/ProfileImage";

const LeftSide = () => {
  return (
    <div className="col-3">
      <div className="left-side">
        <div className="top">
          <div className="image-name">
            <ProfileImage />
          </div>

          <div className="icons">
            <div className="icon">
              <FaEllipsisH />
            </div>
            <div className="icon">
              <FaEdit />
            </div>
          </div>
        </div>

        <div className="friend-search">
          <div className="search">
            <button>
              <FaSistrix />
            </button>
            <input
              type="text"
              name="friend-search"
              id="friend-search"
              placeholder="Search"
              className="form-control"
            />
          </div>
        </div>

        <div className="active-friends">
          <ActiveFriend />
          <div className="friends">
            <div className="hover-friend">
              <Friends />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
