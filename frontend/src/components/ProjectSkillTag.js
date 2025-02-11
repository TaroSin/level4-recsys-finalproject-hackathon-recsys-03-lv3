import React from "react";
import "../style/colors.css";
import "../style/SkillTag.css";

const SkillIcon = ({ text }) => {
  return (
    <span
      className="badge skill-badge"
      style={{ backgroundColor: "var(--color-secondary)" }}
    >
      {text}
    </span>
  );
};

export default SkillIcon;
