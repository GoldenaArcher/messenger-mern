import React from "react";

import RightSide from "./RightSide";
import LeftSide from "./LeftSide";

const Messenger = () => {
  return (
    <div className="messenger">
      <div className="row">
        <LeftSide />
        <RightSide />
      </div>
    </div>
  );
};

export default Messenger;
