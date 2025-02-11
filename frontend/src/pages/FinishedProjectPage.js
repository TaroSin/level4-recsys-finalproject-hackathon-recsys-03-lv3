import React, { useState, useEffect } from "react";
import { Box, Modal } from "@mui/material";
import axios from "axios";

import Loading from "../components/Loading";
import SingleSelector from "../components/SingleSelector";
import SwitchButton from "../components/SwitchButton";

import FinishedProjectInfo from "../components/FinishedProjectInfo";
import ProjectFeedback from "./ProjectFeedback";

import "../style/FinishedProjectPage.css";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/mymony/completed-project`;

const FinishedProjectPage = () => {
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("최신순");
  const [filterOption, setFilterOption] = useState("근무 형태");
  const [showOnlyUnreviewed, setShowOnlyUnreviewed] = useState(false);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null); // 선택한 프로젝트 저장
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // 모달 상태 관리

  // endDate 계산 함수
  const calculateEndDate = (registerDate, duration) => {
    const year = parseInt(registerDate.slice(0, 4), 10);
    const month = parseInt(registerDate.slice(4, 6), 10) - 1; // 월은 0부터 시작
    const day = parseInt(registerDate.slice(6, 8), 10);

    const startDate = new Date(year, month, day);
    startDate.setDate(startDate.getDate() + duration); // 종료일 계산

    const endYear = startDate.getFullYear();
    const endMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const endDay = String(startDate.getDate()).padStart(2, "0");

    return `${endYear}${endMonth}${endDay}`;
  };

  // 필터링 & 정렬 기능 적용
  useEffect(() => {
    let updatedProjects = projects.map((project) => ({
      ...project,
      endDate: calculateEndDate(project.registerDate, project.duration),
      radarData:
        project.expertise !== null
          ? [
              project.expertise,
              project.proactiveness,
              project.punctuality,
              project.maintainability,
              project.communication,
            ]
          : [],
      isReviewed: project.feedbackScore ? true : false,
    }));

    // 평가하지 않은 프로젝트만 보기 기능 적용
    if (showOnlyUnreviewed) {
      updatedProjects = updatedProjects.filter(
        (project) => !project.isReviewed
      );
    }

    if (filterOption !== "근무 형태") {
      updatedProjects = updatedProjects.filter(
        (project) => (project.workType === 0 ? "대면" : "원격") === filterOption
      );
    }

    // 정렬 적용 (최신순 / 금액 높은순)
    if (sortOption === "최신순") {
      updatedProjects.sort((a, b) =>
        b.registerDate.localeCompare(a.registerDate)
      );
    } else if (sortOption === "금액 높은순") {
      updatedProjects.sort((a, b) => Number(b.budget) - Number(a.budget));
    }

    setDisplayedProjects(updatedProjects);
  }, [sortOption, filterOption, showOnlyUnreviewed, projects]); // 옵션(정렬/필터/스위치) 변경 시 실행

  // 평가하기 버튼을 클릭 시 프로젝트의 isReviewed 상태를 변경하고 팝업 창 오픈
  const handleReview = (project) => {
    setSelectedProject(project);
    setIsFeedbackOpen(true); // 모달 열기
  };

  const handleFeedbackSubmit = async (projectId, feedbackData) => {
    const token = sessionStorage.getItem("token");
    console.log(feedbackData);

    if (!token) {
      setError("인증 토큰이 없습니다. 로그인 후 이용해주세요.");
      setLoading(false);
      return;
    }

    try {
      const feedbackRes = await axios.post(
        `${API_BASE_URL}/feedback`,
        feedbackData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.projectId === projectId
          ? {
              ...project,
              ...feedbackData,
              isReviewed: true,
              feedbackScore:
                (feedbackData.expertise +
                  feedbackData.proactiveness +
                  feedbackData.punctuality +
                  feedbackData.maintainability +
                  feedbackData.communication) /
                5, // 평균 점수 계산
            }
          : project
      )
    );
    setIsFeedbackOpen(false); // 모달 닫기
  };

  useEffect(() => {
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

        const processedProjects = response.data.map((project) => {
          const feedbackContent =
            project.feedbackContent
              ?.replace(/\\n/g, "\n") // JSON 이스케이프된 줄바꿈 처리
              .split("\n") // 줄바꿈 기준으로 나누기
              .map((line) => line.trim()) // 각 줄 공백 제거
              .filter((line) => line) // 빈 줄 제거
              .join("\n") // 다시 줄바꿈으로 합치기
              .trimEnd() || ""; // 마지막 줄의 공백 제거

          return {
            ...project,
            feedbackContent,
          };
        });

        setProjects(processedProjects);
      } catch (error) {
        console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
        setError(
          `프로젝트 데이터를 불러오는 데 실패했습니다: [${error.response.data.detail}`
        );
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

  return (
    <div className="finished-project-page-container">
      <div className="header-container">
        <h3 className="header">완료된 프로젝트</h3>
        <p>총 {displayedProjects.length}개의 완료된 프로젝트가 있습니다.</p>
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
          {/* SwitchButton을 클릭하면 setShowOnlyUnreviewed 값 변경 */}
          <SwitchButton
            text="평가하지 않은 프로젝트만 표시"
            onChange={setShowOnlyUnreviewed}
          />

          {/* 정렬용 SingleSelector */}
          <SingleSelector
            title="정렬 기준"
            options={["최신순", "금액 높은순"]}
            onChange={setSortOption}
          />
        </div>
      </div>

      {/* 필터링 + 정렬된 프로젝트 리스트 */}
      {displayedProjects.map((project) => (
        <FinishedProjectInfo
          key={project.projectId}
          content={project}
          onReview={() => handleReview(project)}
        /> // 평가 버튼 클릭 시 호출
      ))}

      {/* 평가 모달 (기존 페이지 위에 오버레이) */}
      <Modal open={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {selectedProject && (
            <ProjectFeedback
              project={selectedProject}
              onClose={() => setIsFeedbackOpen(false)}
              onSubmit={handleFeedbackSubmit}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default FinishedProjectPage;
