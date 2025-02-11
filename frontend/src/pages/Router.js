import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Layout from "../components/Layout";

import AppliedProjectPage from "./AppliedProjectPage";
import CompanyMyPage from "./CompanyMyPage";
import FinishedProjectPage from "./FinishedProjectPage";
import FreelancerDetailPage from "./FreelancerDetailPage";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import ProjectDetailPage from "./ProjectDetailPage";
import ProjectInputPage from "./ProjectInputPage";
import ProjectRegisterPage from "./ProjectRegisterPage";
import RecommendFreelancerPage from "./RecommendFreelancerPage";
import RegisteredProjectsPage from "./RegisteredProjectsPage";
import ScrollToTop from "../components/ScrollToTop";
import SearchFreelancerPage from "./SearchFreelancerPage";
import SearchProjectPage from "./SearchProjectPage";
import SignUpCompanyPage from "./SignUpCompanyPage";
import SignUpFreelancerPage from "./SignUpFreelancerPage";
import SignUpSelectPage from "./SignUpSelectPage";

const AppRouter = () => {
  // 로그인 정보 상태(state) 저장
  const [token, setToken] = useState(
    sessionStorage.getItem("token") || localStorage.getItem("token")
  );
  const [userId, setUserId] = useState(
    sessionStorage.getItem("userId") || localStorage.getItem("userId")
  );
  const [userName, setUserName] = useState(
    sessionStorage.getItem("userName") || localStorage.getItem("userName")
  );
  const [userType, setUserType] = useState(
    sessionStorage.getItem("userType") || localStorage.getItem("userType")
  );

  // sessionStorage 값 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(
        sessionStorage.getItem("token") || localStorage.getItem("token")
      );
      setUserId(
        sessionStorage.getItem("userId") || localStorage.getItem("userId")
      );
      setUserName(
        sessionStorage.getItem("userName") || localStorage.getItem("userName")
      );
      setUserType(
        sessionStorage.getItem("userType") || localStorage.getItem("userType")
      );
    };

    // window 이벤트 리스너 추가 (로그인 후 변경 감지)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 회원가입 관련 경로 */}
        <Route path="/signup" element={<SignUpSelectPage />} />
        <Route path="/signup/freelancer" element={<SignUpFreelancerPage />} />
        <Route path="/signup/company" element={<SignUpCompanyPage />} />

        {/* Layout 적용된 경로 */}
        <Route path="/" element={<Layout />}>
          {/* Layout 내부의 하위 경로 */}
          <Route index element={<MainPage />} />
          <Route path="/search-project" element={<SearchProjectPage />} />
          <Route path="/search-freelancer" element={<SearchFreelancerPage />} />
          <Route path="/freelancer-detail" element={<FreelancerDetailPage />} />
          <Route
            path="/recommend-freelancer/:projectId"
            element={<RecommendFreelancerPage />}
          />
          <Route path="/register-input" element={<ProjectInputPage />} />
          <Route path="/register-result" element={<ProjectRegisterPage />} />
          <Route
            path="/registered-projects"
            element={<RegisteredProjectsPage />}
          />
          <Route path="/finished" element={<FinishedProjectPage />} />
          <Route path="/applied" element={<AppliedProjectPage />} />
          <Route
            path="/mypage"
            element={
              userType === "0" ? <FreelancerDetailPage /> : <CompanyMyPage />
            }
          />

          <Route path="/project-detail" element={<ProjectDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
