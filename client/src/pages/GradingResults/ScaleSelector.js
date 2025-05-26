// src/components/GradingResults/ScaleSelector.js
import React from 'react';

const ScaleSelector = ({ value, onChange }) => {
  return (
    <div className="scale-selector">
      <label htmlFor="score-scale">Score Scale:</label>
      <select 
        id="score-scale"
        value={value} 
        onChange={onChange}
        className="form-select"
      >
        <option value="1">5-point Scale</option>
        <option value="2">20-point Scale</option>
        <option value="5">100-point Scale</option>
        <option value="6">50-point Scale</option>
      </select>
    </div>
  );
};

export default ScaleSelector;