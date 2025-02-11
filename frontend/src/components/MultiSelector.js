import React, { useState, useEffect } from "react";
import "../style/Selectors.css";

const MultiSelector = ({ title, options, value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(value || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  // 외부에서 value가 변경되면 내부 상태를 업데이트
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  // 검색어가 변경될 때 옵션 필터링
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options); // 검색어 없을 때 전체 옵션 표시
    } else {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleOption = (option) => {
    let updatedValues = [...selectedValues];

    if (option === "전체") {
      if (selectedValues.length === options.length) {
        updatedValues = [];
      } else {
        updatedValues = [...options];
      }
    } else if (selectedValues.includes(option)) {
      // 이미 선택된 값이면 제거
      updatedValues = selectedValues.filter((item) => item !== option);
    } else {
      // 선택되지 않은 값이면 추가
      updatedValues = [...selectedValues, option];
    }
    setSelectedValues(updatedValues);
    onChange(updatedValues); // 선택된 값 리스트 업데이트
  };

  return (
    <div className="multi-selector">
      <div className="label-container" onClick={toggleDropdown}>
        <span className="selected-value">
          {selectedValues.length === 0
            ? title // 선택된 값이 없을 때 title 표시
            : selectedValues.length === options.length
              ? title
              : `${selectedValues[0]} ${
                  selectedValues.length === 1
                    ? ""
                    : `외 ${selectedValues.length - 1}개`
                }`}
        </span>
        <span className={`arrow ${isOpen ? "open" : ""}`}>
          <i className="bi bi-caret-down-fill"></i>
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <ul className="dropdown-list">
            <li
              key="전체"
              className="dropdown-item 전체-option"
              onClick={() => toggleOption("전체")}
            >
              {selectedValues.length === options.length ? (
                <span className="checkmark">
                  <i className="bi bi-check"></i>
                </span>
              ) : null}
              전체
            </li>
          </ul>

          {/* 검색 필드 추가 - title이 "스킬"일 때만 */}
          {title === "스킬" && (
            <>
              <li className="divider"></li>
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </>
          )}
          <ul className="dropdown-list">
            {filteredOptions.map((option) => (
              <li
                key={option}
                className={`dropdown-item ${
                  selectedValues.includes(option) ? "selected" : ""
                }`}
                onClick={() => toggleOption(option)}
              >
                {selectedValues.includes(option) && (
                  <span className="checkmark">
                    <i className="bi bi-check"></i>
                  </span>
                )}
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelector;
