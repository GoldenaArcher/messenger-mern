import React from "react";

const ProfileImage = ({
  src = "/uploads/f97e8849079c19aa6686f1556368322d.png",
  alt = "profile-img",
  name,
  isActive = false,
}) => {
  return (
    <>
      <div className="image">
        <img src={`http://localhost:5000${src}`} alt={alt} />
        {isActive && <div className="active-icon"></div>}
      </div>
      {name && (
        <div className="name">
          <h3>{name}</h3>
        </div>
      )}
    </>
  );
};

export default ProfileImage;
