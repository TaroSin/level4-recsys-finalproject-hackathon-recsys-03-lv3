import React from "react";

import photo_0 from "../assets/profile_0.png";
import photo_1 from "../assets/profile_1.png";
import photo_2 from "../assets/profile_2.png";
import photo_3 from "../assets/profile_3.png";
import photo_4 from "../assets/profile_4.png";
import photo_5 from "../assets/profile_5.png";
import photo_6 from "../assets/profile_6.png";
import photo_7 from "../assets/profile_7.png";
import photo_8 from "../assets/profile_8.png";
import photo_9 from "../assets/profile_9.png";

import "../style/Images.css";

const profileImages = [
  photo_0,
  photo_1,
  photo_2,
  photo_3,
  photo_4,
  photo_5,
  photo_6,
  photo_7,
  photo_8,
  photo_9,
];

const ProfileIcon = ({ userId, style = {} }) => {
  const imageIndex = userId % 10;
  const profileImage = profileImages[imageIndex];

  return (
    <a href="#">
      <img
        src={profileImage}
        className="profile-image rounded-circle border"
        alt="profile-icon"
        style={style} // 외부에서 스타일 지정 시 적용
      ></img>
    </a>
  );
};

export default ProfileIcon;
