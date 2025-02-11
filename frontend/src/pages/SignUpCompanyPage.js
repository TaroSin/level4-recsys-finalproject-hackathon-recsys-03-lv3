import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SingleSelector from "../components/SingleSelector";

import logo from "../assets/logo_primary.png";

import "../style/SignUpPage.css";

const SignUpCompany = () => {
  const navigate = useNavigate();

  // 입력 필드 상태 관리
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    locationId: null,
  });

  const [error, setError] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationIdMap, setLocationIdMap] = useState();
  const [selectedLocation, setSelectedLocation] = useState("기업 위치");

  // API에서 거주 지역 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/filter/location`
        );
        const locationOptions = locationRes.data.map(
          (loc) => loc?.locationName ?? "알 수 없음"
        );
        const locationIdMap = {};
        locationRes.data.forEach((loc) => {
          locationIdMap[loc?.locationName] = loc?.locationId;
        });

        setLocationOptions(locationOptions);
        setLocationIdMap(locationIdMap); // locationId를 찾기 위한 매핑 저장
      } catch (error) {
        console.error("거주 지역 데이터 로딩 실패", error);
      }
    };

    fetchData();
  }, []);

  // 입력 필드 값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const headers = {
      Accept: "application/json",
    };

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log(formData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/register/company`,
        {
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          locationId: formData.locationId,
          projectContent: "hi",
        },
        { headers }
      );

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div id="signup-company-page" className="signup-container">
      <div className="signup-card">
        <div className="signup-logo">
          <img src={logo} alt="Harmony Logo" />
        </div>
        <p className="signup-header">
          기업으로 가입 후, 새 프로젝트에 잘 맞는 프리랜서를 찾아보아요!
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-content">
            <input
              type="text"
              name="companyName"
              placeholder="기업 이름"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <SingleSelector
              options={locationOptions}
              value={selectedLocation}
              onChange={(selectedLocationName) => {
                const selectedLocationId = locationIdMap[selectedLocationName];
                setFormData({
                  ...formData,
                  locationId: selectedLocationId,
                });
                setSelectedLocation(selectedLocationName);
              }}
              className="signup-company-selector"
            />
          </div>
          <button type="submit" className="signup-button">
            회원가입 완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpCompany;
