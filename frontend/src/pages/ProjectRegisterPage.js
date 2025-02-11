import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import ProjectSkillTag from "../components/ProjectSkillTag";
import SimilarProject from "../components/SimilarProject";

import botphoto from "../assets/chat_logo.png";

import "../style/ProjectRegisterPage.css";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/mymony/project/register`;

function convertToJSX(text) {
  const sections = text.split(/<([^<>]+)>/).filter(Boolean); // 꺽쇠 괄호를 기준으로 텍스트 분리
  let jsxElements = [];

  for (let i = 0; i < sections.length; i++) {
    const content = sections[i].trim();

    if (i % 2 === 1) {
      // 홀수 인덱스 -> 본문 (꺽쇠 밖의 내용)
      jsxElements.push(<p key={i}>{content}</p>);
    } else {
      // 짝수 인덱스 -> 제목 (꺽쇠 괄호 안의 내용)
      const paragraphs = content.split(/\n+/).filter(Boolean); // 개행 문자 기준으로 나누고 빈 문자열 제거
      paragraphs.forEach((para, index) => {
        jsxElements.push(
          <h5 key={`${i}-${index}`}>
            <strong>{para.trim()}</strong>
          </h5>
        );
      });
    }
  }

  return <div>{jsxElements}</div>;
}

const ProjectRegisterPage = () => {
  const location = useLocation();
  const { projectSummary, projectData } = location.state || {};
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(
    projectSummary.projectContent
  );
  const posting = {
    duration: projectSummary.duration,
    budget: projectSummary.budget,
    workType: projectSummary.workType,
    contractType: projectSummary.contractType,
    priority: projectSummary.priority,
    projectContent: projectSummary.projectContent,
    projectName: projectSummary.projectName,
    categoryId: projectSummary.categoryId,
    categoryName: projectSummary.categoryName,
    skillList: projectSummary.skillIdList,
  };

  const token = sessionStorage.getItem("token");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  if (!projectSummary) {
    return <div>프로젝트 데이터가 없습니다. 다시 시도해주세요.</div>;
  }

  const handleRegister = async (data) => {
    console.log(headers);
    console.log(data);
    try {
      const response = await axios.post(API_BASE_URL, data, {
        headers: headers,
      });
      console.log("데이터 전송 성공");
      alert("프로젝트 등록을 완료했습니다.");
      navigate("/registered-projects");
    } catch (error) {
      console.error("데이터 전송 실패: ", error);
    }
  };

  // 수정 버튼 클릭 시 실행되는 함수
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 수정 확정 버튼 클릭 시 실행되는 함수
  const handleConfirmClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="chat-page result">
      {/* Header */}
      <div className="chat-header">
        <span>새 프로젝트 등록</span>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        <div className="chat-bubble bot">
          <div className="chat-icon m-2">
            <img
              src={botphoto}
              className="profile-image rounded-circle border"
              alt="profile-icon"
              style={{
                width: "45px",
                height: "47px",
                margin: "0",
              }}
            ></img>
          </div>
          <div className="chat-content bot">
            <div className="content-box">
              <p className="label">요청하신 프로젝트의 내용을 확인해주세요.</p>
              <table className="custom-table rounded-table">
                <tbody>
                  <tr>
                    <td className="table-label">프로젝트 이름</td>
                    <td className="table-value">
                      {projectSummary.projectName || "미정"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">산업 분야</td>
                    <td className="table-value">
                      {projectSummary.categoryName || "미정"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">필요 스킬</td>
                    <td className="table-value">
                      {projectSummary.skillNameList.map((skill, index) => (
                        <span>
                          {skill}
                          {index === projectSummary.skillNameList.length - 1
                            ? ""
                            : ", "}
                        </span>
                      )) || "미정"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">프로젝트 기간</td>
                    <td className="table-value">
                      {projectSummary.duration.toLocaleString() || "미정"}일
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">근무 형태</td>
                    <td className="table-value">
                      {projectSummary.workType === 0
                        ? "대면"
                        : "원격" || "미정"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">계약 유형</td>
                    <td className="table-value">
                      {projectSummary.contractType === 0
                        ? "월 단위"
                        : "프로젝트 단위" || "미정"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">계약 시 우선순위</td>
                    <td className="table-value">
                      {projectSummary.priority === 0
                        ? "스킬"
                        : projectSummary.priority === 1
                          ? "금액"
                          : "상관없음" || "미정"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">금액</td>
                    <td className="table-value">
                      {projectData.budget.toLocaleString() || "미정"}원 /
                      {projectSummary.contractType === 0
                        ? " 월"
                        : " 프로젝트" || "월"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">프로젝트 상세 내용</td>
                  </tr>
                  {/* Upstage Chat API 결과 넣기 */}
                  <tr className="table-full-row">
                    <td colSpan="2" className="table-extra">
                      {isEditing ? (
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="custom-textarea"
                        />
                      ) : (
                        convertToJSX(editedContent)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="register-btn-container">
                {/* 수정 버튼 */}
                {isEditing ? (
                  <button
                    className="register-btn btn-edit"
                    onClick={handleConfirmClick}
                  >
                    확정
                  </button>
                ) : (
                  <button
                    className="register-btn btn-edit"
                    onClick={handleEditClick}
                  >
                    수정
                  </button>
                )}
                <button
                  className={`register-btn btn-confirm ${isEditing ? "btn-disabled" : ""}`}
                  type="button"
                  id="sendRequest"
                  onClick={() => {
                    if (!isEditing) {
                      handleRegister(posting);
                    }
                  }}
                  disabled={isEditing} // 수정 중이면 비활성화
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="predict-things">
          <div className="predict-left">
            <SimilarProject projects={projectSummary.similarProjects} />
          </div>
          <div className="predict-right">
            <div className="predict-top">
              <h3 className="section-title">
                예상 견적{" "}
                <span className="unit">
                  ({projectSummary.contractType === 0 ? "월" : "프로젝트"} 단위)
                </span>
              </h3>
              <p className="description">
                유사 프로젝트 데이터를 바탕으로 AI가 분석한 예상 견적입니다.
              </p>
              <div className="estimate-values">
                <div className="estimate-row">
                  <p className="estimate-label">기업의 예상 금액</p>
                  <p className="company-estimate">
                    {projectSummary.budget.toLocaleString()}원
                  </p>
                </div>
                <div className="estimate-row">
                  <p className="estimate-label">AI의 예상 금액</p>
                  <p className="ai-estimate">
                    {projectSummary.expectedBudget.toLocaleString()}원
                  </p>
                </div>
              </div>
              <div className="slider-container">
                <span className="min-value">
                  최저 {projectSummary.minBudget.toLocaleString()}원
                </span>
                <input
                  type="range"
                  min={projectSummary.minBudget}
                  max={projectSummary.maxBudget}
                  value={projectSummary.expectedBudget}
                  readOnly
                />
                <span className="max-value">
                  최고 {projectSummary.maxBudget.toLocaleString()}원
                </span>
              </div>
            </div>
            <div className="predict-bottom">
              <h3 className="section-title">예상 기술 요구사항</h3>
              <p className="description">
                유사 프로젝트에 사용된 스킬을 바탕으로 AI가 분석한 예상 기술
                요구사항입니다.
              </p>
              <div className="skill-container">
                {projectSummary.simSkillNameList.map((skill, i) => (
                  <span key={i} className="badge">
                    <ProjectSkillTag text={skill} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRegisterPage;
