import React from "react";
import { FaEdit, FaEllipsisH, FaSistrix } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useSocket } from "../../context/SocketProvider";

import ActiveFriend from "./ActiveFriend";
import Friends from "./Friend";
import ProfileImage from "../../components/ProfileImage";

import { useFetchFriendsQuery } from "../../store/features/friendApi";

const LeftSide = ({ setCurrentFriend, currentFriend }) => {
  const { activeUsers } = useSocket();
  const { data: friendList } = useFetchFriendsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="col-3">
      <div className="left-side">
        <div className="top">
          <div className="image-name">
            <ProfileImage name={userInfo.username} src={userInfo.image} />
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
          {activeUsers.map((activeUser) => (
            <ActiveFriend
              key={activeUser.id}
              currentFriend={activeUser}
              setCurrentFriend={setCurrentFriend}
            />
          ))}
        </div>
        <div className="friends">
          {friendList?.length
            ? friendList.map((friend) => (
                <div
                  className={`hover-friend ${
                    friend?._id === currentFriend?._id ? "active" : ""
                  }`}
                  key={friend._id}
                  onClick={() => {
                    setCurrentFriend(friend);
                  }}
                >
                  <Friends info={friend} />
                </div>
              ))
            : "No Friend Available"}
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
