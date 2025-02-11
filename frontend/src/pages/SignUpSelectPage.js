import React from "react";
import { useNavigate } from "react-router-dom";

import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";

import logo from "../assets/logo_primary.png";

import "../style/SignUpPage.css";

const SignUpSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-select-container">
      <div className="signup-select-card">
        {/* 로고 */}
        <div className="signup-logo">
          <img src={logo} alt="Harmony Logo" />
        </div>

        {/* 캐치프레이즈 */}
        <p className="signup-caption">HRmony</p>

        {/* 선택 버튼 */}
        <div className="signup-select-buttons">
          <button
            onClick={() => navigate("/signup/freelancer")}
            className="signup-select-btn freelancer-signup"
          >
            <PersonIcon className="signup-icon" />
            <span>개인 계정 가입</span>
            <p className="signup-description">새로운 프로젝트를 찾아보세요!</p>
          </button>
          <button
            onClick={() => navigate("/signup/company")}
            className="signup-select-btn company-signup"
          >
            <BusinessIcon className="signup-icon" />
            <span>기업 계정 가입</span>
            <p className="signup-description">새로운 프리랜서를 찾아보세요!</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpSelectPage;
