import React, { useState } from "react";
import { TextField, Typography, Slider, Modal } from "@mui/material";

import InfoCard from "../components/InfoCard";
import ProjectInfo from "../components/ProjectInfo";

import "../style/ProjectFeedback.css";

const ProjectFeedback = ({ project, onClose, onSubmit }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [feedback, setFeedback] = useState({
    expertise: null,
    proactiveness: null,
    punctuality: null,
    maintainability: null,
    communication: null,
    feedbackContent: "",
    projectId: project.projectId,
    freelancerId: project.freelancerId,
    skillIdList: project.skillIdList,
  });

  const handleSubmit = () => {
    onSubmit(project.projectId, feedback);
  };

  const sliderData = [
    {
      label: "전문성",
      key: "expertise",
      description:
        "해당 프로젝트에서 요구되는 기술이나 지식을 충분히 보유하고 있는지 평가합니다.",
    },
    {
      label: "적극성",
      key: "proactiveness",
      description:
        "프리랜서가 프로젝트 진행 중 얼마나 능동적으로 업무에 참여했는지 평가합니다.",
    },
    {
      label: "의사소통",
      key: "communication",
      description:
        "프리랜서가 기업과의 소통에서 얼마나 명확하고 신속하게 대응했는지를 평가합니다.",
    },
    {
      label: "일정준수",
      key: "punctuality",
      description:
        "프리랜서가 프로젝트 일정과 마감 기한을 얼마나 잘 준수했는지 평가합니다.",
    },
    {
      label: "유지보수",
      key: "maintainability",
      description:
        "프리랜서가 제공한 결과물이 얼마나 관리 및 유지보수가 용이한지 평가합니다.",
    },
  ];

  return (
    <Modal open onClose={onClose} slots={{ backdrop: null }}>
      <div className="feedback-modal">
        {/* 피드백 제목 */}
        <div className="feedback-header-container">
          <h3 className="feedback-header"> 피드백 작성 </h3>
        </div>

        {/* 프로젝트 정보 (팝업 내부) */}
        <div className="feedback-project-info">
          <ProjectInfo content={project} />
        </div>

        {/* 슬라이더 & 피드백 입력란을 감싸는 카드 */}
        <InfoCard className="feedback-info-card">
          <div className="feedback-content">
            {/* 왼쪽: 슬라이더 목록 */}
            <div className="feedback-slider-container">
              {sliderData.map(({ label, key, description }, index) => (
                <div key={index} className="slider-box">
                  <Typography variant="body1" className="slider-label">
                    {label}{" "}
                    <span style={{ float: "right" }}>{feedback[key]}</span>
                  </Typography>
                  <Slider
                    value={feedback[key]}
                    min={0}
                    max={5}
                    step={0.1}
                    onChange={(_, val) =>
                      setFeedback((prev) => ({
                        ...prev,
                        [key]: val,
                      }))
                    }
                    valueLabelDisplay="auto"
                    className="feedback-slider"
                  />
                  <Typography variant="body2" className="slider-description">
                    {description}
                  </Typography>
                </div>
              ))}
            </div>

            {/* 오른쪽: 피드백 입력란 */}
            <div className="feedback-textarea">
              <TextField
                label={isFocused ? "피드백 내용" : ""}
                placeholder="내용을 입력하세요."
                multiline
                fullWidth
                value={feedback.feedbackContent}
                onChange={(e) =>
                  setFeedback({ ...feedback, feedbackContent: e.target.value })
                }
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => setIsFocused(e.target.value.length > 0)} // 입력 없으면 포커스 해제 시 label 숨김
                className="feedback-input"
                sx={{
                  height: "100%", // 전체 높이 설정
                  "& .MuiOutlinedInput-root": {
                    height: "100%", // 컨테이너 높이 설정
                    transition: "border-color 0.3s ease-in-out",
                    alignItems: "flex-start", // placeholder가 첫째 줄에서 시작하도록 설정
                    paddingTop: "10px", // 첫 번째 줄과 가까운 위치에서 시작하도록 조정
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "var(--color-primary) !important", // primary 색 적용
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "var(--color-primary) !important",
                    },
                  "& .MuiInputBase-multiline": {
                    height: "100%", // 멀티라인 입력 필드 높이 설정
                    paddingTop: "15px", // placeholder가 첫 줄에서 시작되도록 설정
                  },
                  "& .MuiInputLabel-root": {
                    fontWeight: "bold", // 피드백 내용 볼드체 처리
                    color: "#999", // 기본 라벨 색
                    transition: "all 0.3s ease-in-out",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "var(--color-primary) !important", // 포커스 시 primary 색 적용
                  },
                }}
              />
            </div>
          </div>
        </InfoCard>

        {/* 하단 버튼 */}
        <div className="feedback-buttons">
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            등록하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectFeedback;
