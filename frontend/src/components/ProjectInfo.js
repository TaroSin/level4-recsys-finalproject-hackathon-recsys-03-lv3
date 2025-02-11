import React, { useRef, useEffect } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

import "../style/colors.css";

import InfoCard from "./InfoCard";
import ProfileIcon from "./ProfileIcon";
import ProjectKeywordIcon from "./ProjectKeywordIcon";
import ProjectSkillTag from "./ProjectSkillTag";

import "../style/ProjectInfo.css";

Chart.register(ArcElement, Tooltip, Legend);

const userId = sessionStorage.getItem("userId");
const userType = sessionStorage.getItem("userType");

const ProjectInfo = ({
  content,
  className = "",
  onClick = null,
  showMatchingScore = false,
}) => {
  const formatDateUsingMath = (dateNumber) => {
    let year = Math.floor(dateNumber / 10000); // 2025
    let month = Math.floor((dateNumber % 10000) / 100); // 2
    let day = dateNumber % 100; // 12

    return `${year}년 ${month}월 ${day}일`;
  };

  const {
    projectId, // 프로젝트 ID
    projectName, // 프로젝트 이름
    duration, // 기간(단위: 일)
    budget, // 예상 금액
    workType, // 근무 형태 (대면: 0, 원격: 1)
    contractType, // 계약 형태(월 단위: 0, 프로젝트 단위: 1)
    status, // 진행상태 (시작 전: 0, 진행 중: 1, 완료: 2)
    registerDate, // 작업 시작일 (YYYYMMDD 형식)
    categoryName, // 산업 분야
    categoryRole = "개발", // 직군
    skillIdList, // 스킬 ID 리스트
    skillNameList, // 스킬 이름 리스트
    locationName, // 지역명
    isReviewed, // 평가 여부
    matchingScore,
  } = content || {};

  const chartRef = useRef(null); // 차트를 그릴 캔버스 참조

  // 매칭 점수에 따라 색상 반환
  const getScoreColor = (score) => {
    if (score >= 70) return "#18bc9c"; // 초록색
    if (score >= 40) return "#ffcd29"; // 노란색
    return "#f27233"; // 빨간색
  };

  const scoreColor = getScoreColor(matchingScore);

  useEffect(() => {
    if (userType === "0" && chartRef.current) {
      // Chart.js 차트 생성
      const chart = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Matching Score", "Remaining"],
          datasets: [
            {
              data: [matchingScore, 100 - matchingScore], // 매칭 점수 데이터
              backgroundColor: [scoreColor, "#f0f0f0"], // 채운 색상
              borderWidth: 0, // 테두리 제거
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "80%", // 도넛 차트의 가운데 비율 설정
          plugins: {
            legend: {
              display: false, // 범례 숨김
            },
          },
        },
      });

      return () => {
        chart.destroy(); // 컴포넌트 언마운트 시 차트 제거
      };
    }
  }, [userType, matchingScore, scoreColor]);

  return (
    <InfoCard className={className}>
      <div className="project-section">
        <div className="left-section">
          <div className="status">
            {status === 0 ? (
              <ProjectKeywordIcon
                color="var(--color-secondary)"
                text="모집 중"
              />
            ) : (
              <ProjectKeywordIcon color="var(--color-star)" text="모집 완료" />
            )}
            {workType === 0 ? (
              <ProjectKeywordIcon color="var(--color-secondary)" text="대면" />
            ) : (
              <ProjectKeywordIcon color="var(--color-secondary)" text="원격" />
            )}
            <ProjectKeywordIcon color="var(--color-primary)" text="NEW" />
          </div>
          <h3 className="project-title">
            <a className="project-link pointer" onClick={onClick}>
              {projectName}
            </a>
          </h3>

          <div className="project-info-grid">
            <div className="project-info-left">
              <p>
                <strong>예상 금액:</strong> {budget.toLocaleString()}원
              </p>
              <p>
                <strong>예상 기간:</strong> {duration}일
              </p>
              <p>
                <strong>근무 시작일:</strong>{" "}
                {formatDateUsingMath(registerDate)}
              </p>
            </div>
            <div className="project-info-right">
              <p>
                <strong>직군:</strong> {categoryRole}
              </p>
              <p>
                <strong>분야:</strong> {categoryName}
              </p>

              <div className="project-location">
                <i className="fas fa-map-marker-alt"></i>
                <p>{locationName}</p>
              </div>
            </div>
          </div>

          <div className="skills">
            {skillNameList && skillNameList.length > 0 ? (
              skillNameList.map((skill, index) => (
                // 각 스킬 태그 출력
                <ProjectSkillTag key={index} text={skill} />
              ))
            ) : (
              <span>스킬 정보 없음</span>
            )}
          </div>
        </div>
        <div className="right-section">
          {/* 매칭 점수 시각화 */}
          {showMatchingScore && (
            <div className="matching-score-container p-3">
              <div className="profile-chart">
                <canvas ref={chartRef} width={100} height={100}></canvas>
                <div className="profile-icon-recommend">
                  <ProfileIcon
                    userId={userId}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <p className="matching-percentage" style={{ color: scoreColor }}>
                {matchingScore}%
              </p>
            </div>
          )}
        </div>
      </div>
    </InfoCard>
  );
};

export default ProjectInfo;
