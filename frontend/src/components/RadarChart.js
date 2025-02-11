import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data, style = {} }) => {
  const chartData = {
    labels: ["전문성", "적극성", "일정준수", "유지보수", "의사소통"],
    datasets: [
      {
        label: "",
        data: data,
        backgroundColor: "rgba(255, 165, 0, 0)",
        borderColor: "#17B294",
        borderWidth: 2.5,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: "#eee" }, // 가이드라인 색상
        grid: { color: "rgba(179, 179, 179, 0.3)" }, // 원형 그리드 색상
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          display: false,
          stepSize: 1,
        },
        pointLabels: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // 범례 숨기기
      },
    },
  };

  return (
    <div style={{ width: "250px", height: "250px", ...style }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
