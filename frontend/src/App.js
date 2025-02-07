import React, { useEffect, useState } from "react";
import axios from "axios";
import AppRouter from "./pages/Router";

const checkTokenExpiration = () => {
  const expiresAt = sessionStorage.getItem("expiresAt");
  const token = sessionStorage.getItem("token");

  if (expiresAt && new Date().getTime() > expiresAt && token) {
    alert("세션이 만료되었습니다. 다시 로그인하세요.");
    handleLogout();
  }
};

const handleLogout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userType");
  sessionStorage.removeItem("expiresAt");
  window.location.href = "/login"; // 로그인 페이지로 이동
};

const App = () => {
  const [skillList, setSkillList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [message, setMessage] = useState("");
  const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/filter`;
  const headers = {
    Accept: "application/json",
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  useEffect(() => {
    fetch("/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
    //.catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [skillRes, categoryRes, locationRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/skill`, { headers }),
          axios.get(`${API_BASE_URL}/category`, { headers }),
          axios.get(`${API_BASE_URL}/location`, { headers }),
        ]);

        setSkillList(JSON.stringify(skillRes.data));
        setCategoryList(JSON.stringify(categoryRes.data));
        setLocationList(JSON.stringify(locationRes.data));
      } catch (error) {
        console.error("필터 불러오기 실패: ", error);
      }
    };

    fetchFilterData();
  }, []);

  sessionStorage.setItem("skill", skillList);
  sessionStorage.setItem("category", categoryList);
  sessionStorage.setItem("location", locationList);

  return (
    <div>
      {/* 라우터 컴포넌트*/}
      <AppRouter />
      <p>{message}</p>
    </div>
  );
};

export default App;
