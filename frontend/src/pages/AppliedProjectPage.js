import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Loading from "../components/Loading";
import ProjectInfo from "../components/ProjectInfo";
import SingleSelector from "../components/SingleSelector";
import SwitchButton from "../components/SwitchButton";

import "../style/AppliedProjectPage.css";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/mymony/applied-project`;
const freelancerId = sessionStorage.getItem("userId");

const AppliedProjectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState("최신순");
  const [filterOption, setFilterOption] = useState("근무 형태");
  const [showOnlyNotMatched, setShowOnlyNotMatched] = useState(false);
  const [displayedProjects, setDisplayedProjects] = useState([]);

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

        // 기존 프로젝트와 전달된 새 프로젝트를 함께 설정
        const newProject = location.state?.newProject;

        // 중복 방지: 기존 데이터에 이미 newProject가 포함되어 있는지 확인
        const isDuplicate = newProject
          ? response.data.some(
              (project) => project.projectId === newProject.projectId
            )
          : false;

        const updatedProjects =
          newProject && !isDuplicate
            ? [...response.data, newProject]
            : response.data;

        setProjects(updatedProjects);

        // location.state 초기화 (중복 추가 방지)
        if (newProject) {
          navigate("/applied", { replace: true, state: {} });
        }
      } catch (err) {
        return [];
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 필터링 & 정렬 기능 적용
  useEffect(() => {
    let updatedProjects = [...projects];
    // 매칭 전 프로젝트만 보기 기능 적용
    if (showOnlyNotMatched) {
      updatedProjects = updatedProjects.filter(
        (project) => project.status === 0
      );
    }

    if (filterOption !== "근무 형태") {
      updatedProjects = updatedProjects.filter(
        (project) => (project.workType === 0 ? "대면" : "원격") === filterOption
      );
    }

    // 정렬 적용 (최신순 / 매칭 점수 높은순 / 금액 높은순)
    if (sortOption === "최신순") {
      updatedProjects.sort((a, b) =>
        b.registerDate.localeCompare(a.registerDate)
      );
    } else if (sortOption === "매칭 점수 높은순") {
      updatedProjects.sort(
        (a, b) => (b.matchingScore || 0) - (a.matchingScore || 0)
      );
    } else if (sortOption === "금액 높은순") {
      updatedProjects.sort((a, b) => Number(b.budget) - Number(a.budget));
    }

    setDisplayedProjects([...updatedProjects]);
  }, [JSON.stringify(projects), sortOption, filterOption, showOnlyNotMatched]); // 옵션(정렬/필터/스위치) 변경 시 실행

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="no-projects-container">
        <p className="error-message">{error}</p>
        {error === "신청한 프로젝트가 없습니다." && (
          <>
            <p>
              자신에게 맞는 프로젝트를 찾아보세요 !<br></br>
              <i class="fa-solid fa-arrow-down mt-3"></i>
            </p>

            <button
              className="search-project-button"
              onClick={() => navigate("/search-project")}
            >
              프로젝트 찾기
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="applied-project-page-container">
      <div className="header-container">
        <h3 className="header">신청한 프로젝트</h3>
        <p>총 {displayedProjects.length}개의 신청한 프로젝트가 있습니다.</p>
      </div>
      <div className="filters">
        <div className="filter-group-left">
          {/* 필터용 SingleSelector */}
          <SingleSelector
            title="근무 형태"
            options={["근무 형태", "대면", "원격"]}
            onChange={setFilterOption}
            value={filterOption}
          />
        </div>

        <div className="filter-group-right">
          {/* SwitchButton을 클릭하면 setShowOnlyNotMatched 값 변경 */}
          <SwitchButton
            text="모집 중인 프로젝트만 표시"
            onChange={setShowOnlyNotMatched}
          />

          {/* 정렬용 SingleSelector */}
          <SingleSelector
            title="정렬"
            options={["최신순", "매칭 점수 높은순", "금액 높은순"]}
            onChange={setSortOption}
          />
        </div>
      </div>

      <div className="project-list-container">
        {displayedProjects.map((project) => (
          <ProjectInfo
            onClick={() =>
              navigate("/project-detail", {
                state: { projectId: project.projectId },
              })
            }
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
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AppliedProjectPage;
