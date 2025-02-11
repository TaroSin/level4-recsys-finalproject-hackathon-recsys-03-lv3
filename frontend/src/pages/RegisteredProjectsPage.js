import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Loading from "../components/Loading";
import ProjectInfo from "../components/ProjectInfo";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/mymony/prestart-project`;

const RegisteredProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
      } catch (error) {
        if (error.response.status === 404) {
          setProjects([]);
          return [];
        } else {
          console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
          setError("프로젝트 데이터를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleRegisterClick = () => {
    navigate("/register-input");
  };

  const handleProjectClick = (projectId, projectName, status) => {
    navigate(`/recommend-freelancer/${projectId}`, {
      state: { projectName, status },
    });
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="no-projects-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="registered-project-container">
      <div className="header-container">
        <div className="header-left">
          <h3 className="header">내가 등록한 프로젝트</h3>
          <p>총 {projects.length}개의 등록한 프로젝트가 있습니다.</p>
        </div>
        <div className="header-right">
          <button className="btn-register" onClick={handleRegisterClick}>
            등록하기
          </button>
        </div>
      </div>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div
            key={project.projectId}
            onClick={() =>
              handleProjectClick(
                project.projectId,
                project.projectName,
                project.status
              )
            }
            style={{ cursor: "pointer" }}
          >
            <ProjectInfo
              key={project.projectId}
              content={{
                projectName: project.projectName,
                skillNameList: project.skillNameList,
                locationName: project.locationName,
                registerDate: project.registerDate,
                duration: project.duration,
                budget: project.budget,
                categoryRole: "개발",
                categoryName: project.categoryName,
                status: project.status,
              }}
            />
          </div>
        ))
      ) : (
        <p className="error-message mt-5 p-3">등록한 프로젝트가 없습니다.</p>
      )}
    </div>
  );
};

export default RegisteredProjects;
