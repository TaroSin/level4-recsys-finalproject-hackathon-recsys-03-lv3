import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import DoughnutChart from "../components/DoughnutChart";
import FreelancerSkillTag from "../components/FreelancerSkillTag";
import FreelancerSuggest from "../components/FreelancerSuggest";
import Loading from "../components/Loading";
import MultiStarRating from "../components/MultiStarRating";
import ProfileIcon from "../components/ProfileIcon";
import RadarChart from "../components/RadarChart";
import SingleStarRating from "../components/SingleStarRating";

import "../style/FreelancerDetailPage.css";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/resource`;
const userType = parseInt(sessionStorage.getItem("userType"), 10);
const userId = parseInt(sessionStorage.getItem("userId"), 10);

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const freelancerId = location.state?.freelancerId || userId;
  const status = location.state?.status || 0; // status 기본값 설정
  const isRecruiting = status === 0; // 모집 완료 여부 확인

  const [freelancerInfo, setFreelancerInfo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!freelancerId) {
      navigate("/search-freelancer"); // freelancerId가 없으면 목록 페이지로 이동
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("인증 토큰이 없습니다.");
      return;
    }

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const fetchFreelancerData = async () => {
      try {
        const [profileRes, progressRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/${freelancerId}/profile`, { headers }),
          axios.get(`${API_BASE_URL}/${freelancerId}/progress`, { headers }),
          axios
            .get(`${API_BASE_URL}/${freelancerId}/feedback`, { headers })
            .catch((err) => {
              if (err.response && err.response.status === 404) {
                return { data: [] }; // 404 발생 시 빈 배열 반환
              }
              throw err;
            }),
        ]);

        setFreelancerInfo(profileRes.data);
        setProgress(progressRes.data);

        const processedHistory = historyRes.data.map((project) => {
          const feedbackContent =
            project.feedbackContent
              ?.replace(/\\n/g, "\n") // JSON 이스케이프된 줄바꿈 처리
              .split("\n") // 줄바꿈 기준으로 나누기
              .map((line) => line.trim()) // 각 줄 공백 제거
              .filter((line) => line) // 빈 줄 제거
              .join("\n") // 다시 줄바꿈으로 합치기
              .trimEnd() || ""; // 마지막 줄 공백 제거

          return {
            ...project,
            feedbackContent,
          };
        });

        setHistory(processedHistory);
      } catch (error) {
        console.error("데이터 불러오기 실패: ", error);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  if (!freelancerInfo || !progress) {
    return <Loading />;
  }

  return (
    <div className="profile-page">
      <ProfileHeader
        freelancerInfo={freelancerInfo}
        isRecruiting={isRecruiting}
      />
      <div className="history-card">
        <h3 className="history-header">프로젝트 히스토리</h3>
        <div className="project-stats">
          <ProjectRates freelancerInfo={freelancerInfo} progress={progress} />
          <ProjectStatus progress={progress} />
        </div>
      </div>
      <div className="history-card">
        <h3 className="history-header">프로젝트 리스트</h3>
        <ProjectHistory history={history} />
      </div>
    </div>
  );
};

const ProfileHeader = ({ freelancerInfo, isRecruiting }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myProject, setMyProject] = useState(null);
  const location = useLocation();
  const freelancerId = location.state?.freelancerId || userId;
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("인증 토큰이 없습니다. 로그인 후 이용해주세요.");
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const proposeRes = await axios.get(
          `${API_BASE_URL}/${freelancerId}/propose`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMyProject(proposeRes.data);
      } catch (error) {
        if (error.response.status === 404) {
          return null;
        } else {
          setError(
            "프로젝트 데이터를 불러오는 데 실패했습니다: ",
            error.response.data.detail
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="mypage-header">
      <div className="header-image">
        <ProfileIcon userId={freelancerId} />
      </div>
      <div className="header-details">
        <h3 className="free-name">{freelancerInfo.freelancerName}</h3>
        <p className="free-role">
          {freelancerInfo.role} | {freelancerInfo.workExp}년 |{" "}
          {freelancerInfo.locationName}
        </p>

        <div className="free-skills">
          {freelancerInfo.skillList
            .map((skillName, index) => ({
              name: skillName,
              score: freelancerInfo.skillScoreList[index],
            })) // 이름과 점수를 객체로 매핑
            .sort((a, b) => b.score - a.score) // 점수를 기준으로 내림차순 정렬
            .map(({ name, score }, index) => (
              <FreelancerSkillTag key={index} text={name} score={score} />
            ))}
        </div>
      </div>
      <div className="for-suggest">
        {userType === 1 && isRecruiting ? (
          <>
            <button
              className="btn-suggest"
              onClick={() => {
                if (myProject) {
                  setIsPopupOpen(true);
                } else {
                  alert("등록한 프로젝트가 없습니다.");
                }
              }}
            >
              제안하기
            </button>
            <FreelancerSuggest
              isOpen={isPopupOpen}
              projectList={myProject}
              onClose={() => setIsPopupOpen(false)}
            />
          </>
        ) : (
          freelancerId === userId && (
            <button className="btn-suggest">정보 수정</button>
          )
        )}
      </div>
    </div>
  );
};

const ProjectRates = ({ freelancerInfo, progress }) => {
  return (
    <div className="profile-rates">
      <div className="rates-header">
        <h4 className="sm-header">프로젝트 평점</h4>
        <MultiStarRating
          className="star-rates"
          rating={
            (freelancerInfo.expertise +
              freelancerInfo.proactiveness +
              freelancerInfo.punctuality +
              freelancerInfo.communication +
              freelancerInfo.maintainability) /
            5
          }
          numRates={progress.projectCount}
        />
      </div>
      <div className="radar-chart-container">
        <RadarChart
          data={[
            freelancerInfo.expertise,
            freelancerInfo.proactiveness,
            freelancerInfo.punctuality,
            freelancerInfo.communication,
            freelancerInfo.maintainability,
          ]}
          style={{ width: "300px", height: "300px" }}
        />
      </div>
    </div>
  );
};

const ProjectStatus = ({ progress }) => {
  return (
    <div className="project-status">
      <div className="rates-header">
        <h4 className="sm-header">프로젝트 진행 상황</h4>
        <p className="status-count">{progress.projectCount}건</p>
      </div>
      <DoughnutChart
        data={[progress.completedCount, progress.ongoingCount]}
        style={{ margin: "30px 0" }}
      />
    </div>
  );
};

const ProjectHistory = ({ history }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex + 2 < history.length) {
      setCurrentIndex(currentIndex + 2);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 2 >= 0) {
      setCurrentIndex(currentIndex - 2);
    }
  };

  return (
    <div className="project-history-container">
      <div className="project-history">
        {history.slice(currentIndex, currentIndex + 2).map((project, index) => (
          <div key={index} className="history-item">
            <h5 className="history-title">{project.projectName}</h5>
            <div className="history-info">
              <div>
                <span className="info-label">금액</span>{" "}
                <span className="budget">
                  {project.budget.toLocaleString()}원
                </span>
              </div>
              <div className="info-items">
                <div className="rates-header">
                  <div className="info-du">
                    <span className="info-label">기간</span>{" "}
                    <span className="info-value">
                      {typeof project.duration === "string"
                        ? project.duration.replace(
                            /(\d{4})(\d{2})(\d{2})/,
                            "$1년 $2월 $3일"
                          )
                        : `${project.duration}일`}
                    </span>
                  </div>
                  <SingleStarRating score={project.feedbackScore} />
                </div>
              </div>
            </div>
            <div className="radar-chart-container">
              <RadarChart
                data={[
                  project.expertise,
                  project.proactiveness,
                  project.punctuality,
                  project.communication,
                  project.maintainability,
                ]}
              />
            </div>
            <p className="review-comment">
              {project.feedbackContent.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>
      {/* 네비게이션 버튼 */}
      <div className="navigation-buttons">
        <button
          className="prev-button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &lt; 이전
        </button>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={currentIndex + 2 >= history.length}
        >
          다음 &gt;
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
