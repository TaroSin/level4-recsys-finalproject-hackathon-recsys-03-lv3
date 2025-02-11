import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import botphoto from "../assets/chat_logo.png";

import "react-datepicker/dist/react-datepicker.css";
import "../style/ProjectInputPage.css";

const workType = ["대면", "원격"];
const ProjectType = ["외주", "기간제"];
const Priority = ["스킬", "금액", "상관없음"];

const questions = [
  "요청할 프로젝트의 내용을 입력해주세요.",
  "요청할 프로젝트의 예상 기간을 입력해주세요.",
  "원하는 근무 형태를 선택해주세요.",
  "원하는 계약 유형을 선택해주세요.",
  "계약 시 우선순위 고려 대상을 선택해주세요.",
  "요청할 프로젝트의 예상 금액을 입력해주세요.",
];

const DropdownSelector = ({
  label,
  options,
  selectedValue,
  setSelectedValue,
  isButtonClicked,
  setIsButtonClicked,
  handleNextStep,
  dropdownIdx,
}) => {
  const DropdownList = ["근무 형태", "계약 유형", "우선순위"];

  return (
    <div className="content-box">
      <p className="chat-label">{label}</p>
      <div className="dropdown-container">
        <select
          className="custom-select"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="" disabled>
            {DropdownList[dropdownIdx]}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          className={`custom-btn ${isButtonClicked ? "btn-disabled" : "btn-active"}`}
          onClick={() => {
            if (selectedValue) {
              handleNextStep();
              setIsButtonClicked(true);
            }
          }}
          disabled={!selectedValue || isButtonClicked}
        >
          ✓
        </button>
      </div>
    </div>
  );
};

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/mymony/project/init`;

const ProjectInputPage = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [projectSummary, setProjectSummary] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [isDayButtonClicked, setDayIsButtonClicked] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [isworkTypeButtonClicked, setIsworkTypeButtonClicked] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [isProjectTypeButtonClicked, setIsProjectTypeButtonClicked] =
    useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [isPriorityButtonClicked, setIsPriorityButtonClicked] = useState(false);
  const [selectedContractType, setSelectedContractType] = useState("월");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [isBudgetButtonClicked, setIsBudgetButtonClicked] = useState(false);
  const [projectData, setProjectData] = useState({
    projectContent: "",
    duration: null,
    workType: null,
    // projectType: "",
    priority: null,
    contractType: null,
    budget: null,
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      navigate("/register-result", { state: { projectSummary, projectData } });
    }
  }, [isLoading]);

  // 첫 번째 질문 표시
  useEffect(() => {
    setChatHistory([{ sender: "bot", text: questions[0] }]);
  }, []);

  useEffect(() => {
    const chatBody = document.querySelector(".chat-body");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [chatHistory]);

  const handleUserInput = () => {
    let updatedChat = [...chatHistory];

    if (step === 0) {
      updatedChat.push({ sender: "user", text: userInput });
      setProjectData((prev) => ({
        ...prev,
        projectContent: userInput,
      }));
    } else if (step === 1) {
      setProjectData((prev) => ({
        ...prev,
        duration: parseInt(selectedDuration, 10),
      }));
    } else if (step === 2) {
      setProjectData((prev) => ({
        ...prev,
        workType: selectedWorkType === "대면" ? 0 : 1,
      }));
    } else if (step === 3) {
      setProjectData((prev) => ({
        ...prev,
        // projectType: selectedProjectType,
      }));
    } else if (step === 4) {
      setProjectData((prev) => ({
        ...prev,
        priority:
          selectedPriority === "스킬" ? 0 : selectedPriority === "금액" ? 1 : 2,
      }));
    } else if (step === 5) {
      const updatedData = {
        contractType: selectedContractType === "월" ? 0 : 1,
        budget: parseInt(selectedBudget, 10),
      };
      console.log("업데이트될 데이터:", updatedData); // 디버깅 로그 추가
      setProjectData((prev) => {
        const newData = { ...prev, ...updatedData };
        console.log("최종 업데이트된 projectData:", newData); // 상태 변경 후 확인
        postProjectData(newData); // 변경된 값으로 API 요청 실행
        return newData;
      });
    }

    if (step === questions.length - 1) {
      updatedChat.push({ sender: "bot", text: "요약 중..." });
      setChatHistory(updatedChat);
    } else {
      updatedChat.push({ sender: "bot", text: questions[step + 1] });
    }

    setChatHistory(updatedChat);
    setStep((prev) => prev + 1);
    setUserInput(""); // 입력 초기화
  };

  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("인증 토큰이 없습니다.");
    return;
  }

  const postProjectData = async (data) => {
    try {
      setIsLoading(true); // POST 요청 시작 시 로딩 상태 활성화
      console.log("전송할 데이터:", data);

      const response = await axios.post(API_BASE_URL, data, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("데이터 전송 성공:", JSON.stringify(response.data));
      setProjectSummary(response.data);
      setIsSuccess(true);
    } catch (error) {
      console.error("데이터 불러오기 실패: ", error);
    } finally {
      setIsLoading(false); // 요청이 끝나면 로딩 상태 비활성화
    }
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <span>새 프로젝트 등록</span>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        {chatHistory.map((chat, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${chat.sender === "user" ? "user" : "bot"}`}
          >
            {/* 챗봇 메시지에만 아이콘 추가 */}
            {chat.sender === "bot" && (
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
            )}
            <div className={`chat-content ${chat.sender}`}>
              {chat.text === questions[1] ? (
                // Duration
                <div className="content-box">
                  <p className="chat-label">{chat.text}</p>
                  <div className="custom-input-container">
                    <input
                      className="custom-input"
                      type="number"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      min="1"
                    />
                    <span className="unit-text">일</span>
                    <button
                      className={`custom-btn ${
                        isDayButtonClicked ? "btn-disabled" : "btn-active"
                      }`}
                      onClick={() => {
                        if (selectedDuration) {
                          handleUserInput();
                          setDayIsButtonClicked(true);
                        }
                      }}
                      disabled={
                        !selectedDuration ||
                        isNaN(selectedDuration) ||
                        isDayButtonClicked
                      }
                    >
                      ✓
                    </button>
                  </div>
                </div>
              ) : chat.text === questions[2] ? (
                // workType
                <DropdownSelector
                  label={chat.text}
                  options={workType}
                  selectedValue={selectedWorkType}
                  setSelectedValue={(value) => {
                    setSelectedWorkType(value);
                    setProjectData((prev) => ({
                      ...prev,
                      workType: value,
                    }));
                  }}
                  isButtonClicked={isworkTypeButtonClicked}
                  setIsButtonClicked={setIsworkTypeButtonClicked}
                  handleNextStep={handleUserInput}
                  dropdownIdx={0}
                />
              ) : chat.text === questions[3] ? (
                // ProjectType
                <DropdownSelector
                  label={chat.text}
                  options={ProjectType}
                  selectedValue={selectedProjectType}
                  setSelectedValue={setSelectedProjectType}
                  isButtonClicked={isProjectTypeButtonClicked}
                  setIsButtonClicked={setIsProjectTypeButtonClicked}
                  handleNextStep={handleUserInput}
                  dropdownIdx={1}
                />
              ) : chat.text === questions[4] ? (
                // Priority
                <DropdownSelector
                  label={chat.text}
                  options={Priority}
                  selectedValue={selectedPriority}
                  setSelectedValue={setSelectedPriority}
                  isButtonClicked={isPriorityButtonClicked}
                  setIsButtonClicked={setIsPriorityButtonClicked}
                  handleNextStep={handleUserInput}
                  dropdownIdx={2}
                />
              ) : chat.text === questions[5] ? (
                // Budget
                <div className="content-box">
                  <p className="chat-label">{chat.text}</p>
                  <div className="budget-container">
                    <button
                      className="custom-btn btn-outline"
                      onClick={() =>
                        setSelectedContractType((prev) =>
                          prev === "월" ? "프로젝트" : "월"
                        )
                      }
                    >
                      {selectedContractType} 단위
                    </button>
                    <input
                      type="number"
                      className="custom-input"
                      placeholder={`${selectedContractType} 금액`}
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      step="100000"
                    />
                    <span className="unit-text">원</span>
                    <button
                      className={`custom-btn ${isBudgetButtonClicked ? "btn-disabled" : "btn-active"}`}
                      onClick={() => {
                        if (selectedBudget) {
                          handleUserInput();
                          setIsBudgetButtonClicked(true);
                        }
                      }}
                      disabled={
                        !selectedBudget ||
                        isNaN(selectedBudget) ||
                        !selectedContractType ||
                        isBudgetButtonClicked
                      }
                    >
                      ✓
                    </button>
                  </div>
                </div>
              ) : typeof chat.text === "string" ? (
                chat.text.split("\n").map((line, i) => (
                  <p key={i} className="m-0">
                    {line}
                  </p>
                ))
              ) : (
                chat.text
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && userInput.trim()) {
              handleUserInput();
            }
          }}
          disabled={step >= questions.length}
        />
        <button
          className="custom-btn btn-send"
          onClick={handleUserInput}
          disabled={step >= questions.length}
        >
          <i class="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ProjectInputPage;
