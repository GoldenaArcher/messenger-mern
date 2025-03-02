import React, { useEffect, useState } from "react";

import RightSide from "./RightSide";
import LeftSide from "./LeftSide";

import { useFetchFriendsQuery } from "../../store/features/friendApi";

const Messenger = () => {
  const { data: friendList } = useFetchFriendsQuery();

  const [currentFriend, setCurrentFriend] = useState(null);

  useEffect(() => {
    if (friendList?.length) {
      setCurrentFriend(friendList[0]);
    }
  }, [friendList]);

  return (
    <div className="messenger">
      <div className="row">
        <LeftSide
          setCurrentFriend={setCurrentFriend}
          currentFriend={currentFriend}
        />
        {currentFriend ? (
          <RightSide currentFriend={currentFriend} />
        ) : (
          "Please select a friend."
        )}
      </div>
    </div>
  );
};

export default Messenger;
