import React from "react";

import "../style/colors.css";

import photo from "../assets/main_page.png";
import logo from "../assets/main_logo.png";

import "../style/MainPage.css";

const MainPage = () => {
  const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/filter`;
  const headers = {
    Accept: "application/json",
  };

  return (
    <div className="magnet">
      <div className="magnet-content">
        <div className="magnet-image-container">
          <img src={photo} alt="Human Resource and Company Harmony" />
        </div>
        <div className="text-container">
          <div className="title">
            <div className="title-line line1">
              <span className="highlight">H</span>uman&nbsp;{" "}
              <span className="highlight">R</span>
              esource와
            </div>
            <div className="title-line line2">
              <div className="company">
                Compan
                <span className="highlight">y</span>의 조화를 이루는
              </div>
              <img src={logo} alt="Hrmony Logo" className="hrmony-logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainPage;
