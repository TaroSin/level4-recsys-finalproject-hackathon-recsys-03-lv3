import React from "react";
import { useNavigate } from "react-router-dom";

import ProjectSkillTag from "./ProjectSkillTag";

import "../style/SimilarProject.css";

const SimilarProject = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className="similar-project-container">
      <p className="section-title">유사한 프로젝트</p>

      {/* 캐러셀 */}
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {/* 프로젝트 데이터를 두 개씩 묶어서 렌더링 */}
          {projects.reduce((acc, project, index) => {
            if (index % 2 === 0) {
              const slide = (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={index}
                >
                  <div className="row">
                    {/* 첫 번째 카드 */}
                    <div className="col-md-12">
                      <div className="cus-card1 p-3">
                        <a
                          className="pointer"
                          onClick={() =>
                            navigate("/project-detail", {
                              state: { projectId: projects[index].projectId },
                            })
                          }
                        >
                          <h5 className="projects-title">
                            {projects[index].projectName}
                          </h5>
                        </a>
                        <p className="category">
                          {projects[index].categoryName}
                        </p>
                        <div className="project-info">
                          <div className="info-item">
                            <span className="info-label">예상 금액</span>{" "}
                            <span className="budget">
                              {projects[index].budget.toLocaleString()}원
                            </span>
                            <span className="info-value">
                              <i class="bi bi-geo-alt ps-3 pe-1"></i>
                              {projects[index].locationName}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">작업 시작일</span>{" "}
                            <span className="info-value">
                              {projects[index].registerDate.replace(
                                /(\d{4})(\d{2})(\d{2})/,
                                "$1년 $2월 $3일"
                              )}{" "}
                              ({projects[index].duration}일)
                            </span>
                          </div>
                        </div>
                        <div>
                          {projects[index].skillNameList.map((skill, i) => (
                            <span key={i} className="badge">
                              <ProjectSkillTag text={skill} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 두 번째 카드 (데이터가 존재하는 경우) */}
                    {projects[index + 1] && (
                      <div className="col-md-12">
                        <div className="cus-card p-3">
                          <a
                            className="pointer"
                            onClick={() =>
                              navigate("/project-detail", {
                                state: {
                                  projectId: projects[index + 1].projectId,
                                },
                              })
                            }
                          >
                            <h5 className="projects-title">
                              {projects[index + 1].projectName}
                            </h5>
                          </a>
                          <p className="category">
                            {projects[index + 1].categoryName}
                          </p>
                          <div className="project-info">
                            <div className="info-item">
                              <span className="info-label">예상 금액</span>{" "}
                              <span className="budget">
                                {projects[index + 1].budget.toLocaleString()}원
                              </span>
                              <span className="info-value">
                                <i class="bi bi-geo-alt ps-3"></i>
                                {projects[index + 1].locationName}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">작업 시작일</span>{" "}
                              <span className="info-value">
                                {projects[index].registerDate.replace(
                                  /(\d{4})(\d{2})(\d{2})/,
                                  "$1년 $2월 $3일"
                                )}{" "}
                                ({projects[index].duration}일)
                              </span>
                            </div>
                          </div>
                          <div>
                            {projects[index + 1].skillNameList.map(
                              (skill, i) => (
                                <span key={i} className="badge">
                                  <ProjectSkillTag text={skill} />
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
              acc.push(slide);
            }
            return acc;
          }, [])}
        </div>
      </div>
      {/* 이전 버튼 */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <i className="fa-solid fa-caret-left"></i>
        <span className="visually-hidden">Previous</span>
      </button>

      {/* 다음 버튼 */}
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <i className="fa-solid fa-caret-right"></i>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default SimilarProject;
