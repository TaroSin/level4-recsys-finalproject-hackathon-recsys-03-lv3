import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Loading from "../components/Loading";
import MultiSelector from "../components/MultiSelector";
import ProjectInfo from "../components/ProjectInfo";
import SingleSelector from "../components/SingleSelector";
import SwitchButton from "../components/SwitchButton";

import "../style/SearchPages.css";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/project`;

const SearchProjectPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userType = sessionStorage.getItem("userType");

  const skillList = JSON.parse(sessionStorage.getItem("skill") || "[]").map(
    (skill) => skill.skillName
  );

  // 필터 상태
  const [showOnlyRecruiting, setShowOnlyRecruiting] = useState(true);
  const [sortOption, setSortOption] = useState("최신순");
  const [categoryFilterOption, setCategoryFilterOption] = useState("산업 분야");
  const [workTypeFilterOption, setWorkTypeFilterOption] = useState("근무 형태");
  const [skillFilterOption, setSkillFilterOption] = useState(skillList);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("인증 토큰이 없습니다. 로그인 후 이용해주세요.");
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);

        console.log(response.data);
      } catch (error) {
        console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
        setError("프로젝트 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="no-projects-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  const workTypeMapping = { 0: "대면", 1: "원격" };

  // 필터링 로직
  const filteredProjects = projects
    .filter((project) => {
      return (
        (!showOnlyRecruiting || project.status === 0) &&
        (workTypeFilterOption === "근무 형태" ||
          workTypeMapping[project.workType] === workTypeFilterOption) &&
        (categoryFilterOption === "산업 분야" ||
          project.categoryName === categoryFilterOption) &&
        project.skillNameList.some((skill) => skillFilterOption.includes(skill))
      );
    })
    .sort((a, b) => {
      // 정렬 로직
      if (sortOption === "매칭 점수 높은순")
        return b.matchingScore - a.matchingScore;
      if (sortOption === "최신순") return b.registerDate - a.registerDate;
      if (sortOption === "금액 높은순") return b.budget - a.budget;
      return 0;
    });

  const resetFilters = () => {
    setCategoryFilterOption("산업 분야");
    setWorkTypeFilterOption("근무 형태");
    setSkillFilterOption(skillList);
    setSortOption("최신순");
    setShowOnlyRecruiting(true);
  };

  return (
    <div className="search-project-container">
      <div className="header-container">
        <h3 className="header">프로젝트 리스트</h3>
        <p>총 {filteredProjects.length}개의 프로젝트가 있습니다.</p>
      </div>
      <div className="filters">
        {/* 필터 UI */}
        <div className="filter-group-left">
          <SingleSelector
            options={[
              "소프트웨어/IT",
              "금융",
              "소매/소비자",
              "미디어/광고",
              "제조업",
              "운송/공급망",
              "정부",
              "에너지",
              "헬스케어",
              "교육",
            ]}
            onChange={setCategoryFilterOption}
            value={categoryFilterOption}
          />
          <SingleSelector
            title="근무 형태"
            options={["근무 형태", "대면", "원격"]}
            onChange={setWorkTypeFilterOption}
            value={workTypeFilterOption}
          />
          <MultiSelector
            title="스킬"
            options={skillList}
            onChange={setSkillFilterOption}
            value={skillFilterOption}
          />

          {/* 필터 초기화 버튼 */}
          <button className="reset-button" onClick={resetFilters}>
            <i className="bi bi-arrow-counterclockwise"></i> 필터 초기화
          </button>
        </div>
        <div className="filter-group-right">
          <SwitchButton
            text="모집 중인 프로젝트만 표시"
            onChange={setShowOnlyRecruiting}
            value={showOnlyRecruiting}
          />

          <SingleSelector
            options={
              userType === "1"
                ? ["최신순", "금액 높은순"]
                : ["최신순", "매칭 점수 높은순", "금액 높은순"]
            }
            onChange={setSortOption}
            value={sortOption}
          />
        </div>
      </div>

      {/* 필터링된 프로젝트 리스트 */}
      {filteredProjects.map((project) => (
        <ProjectInfo
          key={project.projectId}
          content={{
            projectName: project.projectName,
            duration: project.duration,
            budget: project.budget,
            workType: project.workType,
            skillNameList: project.skillNameList,
            locationName: project.locationName,
            registerDate: project.registerDate,
            categoryRole: "개발",
            categoryName: project.categoryName,
            status: project.status,
            matchingScore: project.matchingScore,
          }}
          showMatchingScore={userType === "0" ? true : false}
          onClick={() =>
            navigate("/project-detail", {
              state: { projectId: project.projectId },
            })
          }
        />
      ))}
    </div>
  );
};

export default SearchProjectPage;
