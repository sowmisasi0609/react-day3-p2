import React from "react";

const ProgressBar = ({ step }) => {
  return (
    <div className="progress-bar">
      <div className={step >= 1 ? "active" : ""}>Step 1: Details</div>
      <div className={step >= 2 ? "active" : ""}>Step 2: Review</div>
      <div className={step >= 3 ? "active" : ""}>Step 3: Done</div>
    </div>
  );
};

export default ProgressBar;
