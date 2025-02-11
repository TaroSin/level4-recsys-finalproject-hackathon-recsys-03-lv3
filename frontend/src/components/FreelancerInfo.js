import React, { useRef, useEffect } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

import FreelancerSkillTag from "./FreelancerSkillTag";
import InfoCard from "./InfoCard";
import ProfileIcon from "./ProfileIcon";
import RadarChart from "./RadarChart";
import SingleStarRating from "./SingleStarRating";

import "../style/FreelancerInfo.css";

Chart.register(ArcElement, Tooltip, Legend);

const FreelancerInfo = ({ freelancerInfo, pageType }) => {
  const {
    freelancerId,
    freelancerName,
    workExp,
    workType,
    role,
    freelancerContent,
    locationName,
    skillList,
    skillScoreList,
    feedbackCount,
    feedbackScore,
    expertise,
    proactiveness,
    punctuality,
    communication,
    maintainability,
    matchingScore,
  } = freelancerInfo;

  const chartRef = useRef(null); // 차트를 그릴 캔버스 참조

  // 매칭 점수에 따라 색상 반환
  const getScoreColor = (score) => {
    if (score >= 70) return "#18bc9c"; // 초록색
    if (score >= 40) return "#ffcd29"; // 노란색
    return "#f27233"; // 빨간색
  };

  const scoreColor = getScoreColor(matchingScore);

  useEffect(() => {
    if (pageType === "recommend" && chartRef.current) {
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
  }, [pageType, matchingScore, scoreColor]);

  return (
    <InfoCard>
      <div className="d-flex align-items-center">
        {/* 프로필 사진 - Search*/}
        {pageType === "search" && (
          <div className="search-photo p-3 me-5">
            <ProfileIcon
              userId={freelancerId}
              style={{ width: "130px", height: "130px" }}
            />
          </div>
        )}

        {/* 프로필 사진 - Recommend */}
        {pageType === "recommend" && (
          <div className="matching-score-container p-3 me-5">
            <div className="profile-chart">
              {/* Chart.js 캔버스 */}
              <canvas ref={chartRef} width={100} height={100}></canvas>
              <div className="profile-icon-recommend">
                <ProfileIcon
                  userId={freelancerId}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <p className="matching-percentage" style={{ color: scoreColor }}>
              {matchingScore}%
            </p>
          </div>
        )}

        {/* 프로필 정보 */}
        <div className="profile-info me-4" style={{ flex: 2 }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-1">{freelancerName}</h5>
            <div className="feedback-score d-flex align-items-center">
              <SingleStarRating
                score={feedbackScore}
                reviewCount={feedbackCount}
              ></SingleStarRating>
            </div>
          </div>
          <div className="field mb-2">
            {role} | {workExp}년 | {workType === 0 ? "대면" : "원격"} |{" "}
            {locationName}
          </div>
          <div className="intro">{freelancerContent}</div>
          <div className="skillList d-flex flex-wrap mt-3">
            {skillList
              .map((skillName, index) => ({
                name: skillName,
                score: skillScoreList[index],
              })) // 이름과 점수를 객체로 매핑
              .sort((a, b) => b.score - a.score) // 점수를 기준으로 내림차순 정렬
              .slice(0, 7) // 상위 7개만 선택
              .map(({ name, score }, index) => (
                <FreelancerSkillTag key={index} text={name} score={score} />
              ))}
            {skillList.length > 7 && <span className="more-skills">...</span>}
          </div>
        </div>

        {/* 방사형 차트 */}
        <div className="radar-chart">
          <RadarChart
            data={[
              expertise,
              proactiveness,
              punctuality,
              maintainability,
              communication,
            ]}
          />
        </div>
      </div>
    </InfoCard>
  );
};

export default FreelancerInfo;
