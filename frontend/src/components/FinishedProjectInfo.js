import React from "react";

import InfoCard from "./InfoCard";
import ProjectSkillTag from "./ProjectSkillTag";
import RadarChart from "./RadarChart";
import SingleStarRating from "./SingleStarRating";

import "../style/FinishedProjectInfo.css";

const formatDate = (dateNumber) => {
  let year = Math.floor(dateNumber / 10000); // 2025
  let month = Math.floor((dateNumber % 10000) / 100); // 2
  let day = dateNumber % 100; // 12

  return `${year}년 ${month}월 ${day}일`;
};

const FinishedProjectInfo = ({ content, onReview }) => {
  const {
    projectId,
    projectName,
    duration,
    budget,
    workType, // 근무 형태(상주: 0, 원격: 1)
    status, // 진행 상태(시작 전: 0, 진행 중: 1, 완료: 2)
    registerDate,
    endDate,
    categoryRole = "개발", // 직군
    categoryName,
    skillIdList,
    skillNameList,
    radarData,
    feedbackScore,
    feedbackContent,
    isReviewed,
  } = content;

  // 평가 내용에서 줄바꿈(\n)을 <br />로 변환
  const renderFeedbackContent = (content) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <InfoCard>
      <div
        className={`finished-project-container ${isReviewed ? "review-mode" : ""}`}
      >
        {/* 왼쪽: 프로젝트 정보 */}
        <div className="left-section">
          <div className="title-section">
            <h3 className="project-title">{projectName}</h3>
            {isReviewed && (
              <div className="rating">
                <SingleStarRating score={content.feedbackScore} />
              </div>
            )}
          </div>

          <div className="project-info-grid">
            <div className="project-info-left">
              <p>
                <strong>기간:</strong> {duration}일
              </p>
              <p>
                <strong>작업 시작일:</strong> {formatDate(registerDate)}
              </p>
              <p>
                <strong>작업 종료일:</strong> {formatDate(endDate)}
              </p>
            </div>
            <div className="project-info-right">
              <p>
                <strong>금액:</strong> {budget.toLocaleString()}원
              </p>
              <p>
                <strong>직군:</strong> {categoryRole}
              </p>
              <p>
                <strong>분야: </strong> {categoryName}
              </p>
            </div>
          </div>
          <div className="finished-skills">
            {skillNameList.length > 0 ? (
              skillNameList.map((skill, index) => (
                <ProjectSkillTag key={index} text={skill} />
              ))
            ) : (
              <span>스킬 정보 없음</span>
            )}
          </div>
        </div>

        {/* 오른쪽: 평가 정보 */}
        <div className="right-section">
          {!isReviewed ? (
            <div className="before-review-container">
              <button className="review-button" onClick={onReview}>
                평가하기
              </button>
              <p className="review-placeholder-text">
                평가를 완료하면 점수가 표시됩니다.
              </p>
            </div>
          ) : (
            <>
              <div className="radar-chart">
                <RadarChart data={radarData ?? [0, 0, 0, 0, 0]} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 평가 내용을 줄바꿈 반영하여 렌더링 */}
      {feedbackContent && (
        <p className="review-comment">
          {renderFeedbackContent(feedbackContent)}
        </p>
      )}
    </InfoCard>
  );
};

export default FinishedProjectInfo;
