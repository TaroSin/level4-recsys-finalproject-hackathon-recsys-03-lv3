import React, { useEffect, useState } from "react";
import axios from "axios";

import "../style/colors.css";

import InfoCard from "../components/InfoCard";
import Loading from "../components/Loading";
import ProfileIcon from "../components/ProfileIcon.js";

import "../style/CompanyMyPage.css";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/mymony`;
const companyId = sessionStorage.getItem("userId");

const CompanyMyPage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("인증 토큰이 없습니다. 로그인 후 이용해주세요.");
      setLoading(false);
      return;
    }

    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/${companyId}/profile`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompany(response.data);
      } catch (err) {
        console.error("기업 데이터를 불러오는 데 실패했습니다:", err);
        setError("기업 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="no-projects-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-container">
        <InfoCard>
          <div className="profile-photo p-3">
            <ProfileIcon userId={companyId} />
            <div className="company-info">
              <h2 className="company-name">{company.companyName}</h2>
              <p className="company-address">
                <i class="bi bi-geo-alt pe-1"></i>
                {company.locationName}
              </p>
            </div>
          </div>
          <div className="intro-section">
            <p className="company-introduction">기업 소개</p>
            <p className="company-content">{company.companyContent}</p>
          </div>
        </InfoCard>
        <div class="button-container">
          <button class="btn-suggest">정보수정</button>
        </div>
      </div>
    </>
  );
};
export default CompanyMyPage;
