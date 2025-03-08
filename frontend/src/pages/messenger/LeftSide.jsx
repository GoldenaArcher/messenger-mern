import React from "react";
import { FaEdit, FaEllipsisH, FaSistrix } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useSocket } from "../../context/SocketProvider";

import ActiveFriend from "./ActiveFriend";
import Friend from "./Friend";
import ProfileImage from "../../components/ProfileImage";

import { useFetchFriendsQuery } from "../../store/features/friendApi";
import { useFetchLastFriendMessagesQuery } from "../../store/features/messageApi";

const LeftSide = ({ setCurrentFriend, currentFriend }) => {
  const { activeUsers } = useSocket();
  const { data: friendList } = useFetchFriendsQuery();
  const { data: mostRecentMessageList } = useFetchLastFriendMessagesQuery(
    friendList?.length ? { friendList } : undefined,
    { skip: !friendList || !friendList.length }
  );

  const { userInfo } = useSelector((state) => state.auth);

  const getFriendsList = () => {
    if (!friendList?.length) return "No Friend Available";

    return friendList.map((friend) => {
      const lastMsg = mostRecentMessageList?.find(
        (msg) => msg.sender === friend?._id || msg.receiver === friend?._id
      );

      return (
        <div
          className={`hover-friend ${
            friend?._id === currentFriend?._id ? "active" : ""
          }`}
          key={friend._id}
          onClick={() => {
            setCurrentFriend(friend);
          }}
        >
          <Friend
            info={friend}
            lastMsg={lastMsg}
            userId={userInfo.id}
            currentFriend={currentFriend}
          />
        </div>
      );
    });
  };

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
        <div className="friends">{getFriendsList()}</div>
      </div>
    </div>
  );
};

export default LeftSide;
