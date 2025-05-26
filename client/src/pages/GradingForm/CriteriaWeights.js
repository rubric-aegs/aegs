import React, { useState, useEffect } from 'react';

const CriteriaWeights = ({ 
  rubrics, 
  selectedRubric, 
  weights, 
  handleWeightChange, 
  resetWeights, 
  calculateTotalWeight, 
  handleApplySettings, 
  settingsApplied,
  weightMin
}) => {
  const totalWeight = calculateTotalWeight();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCriteria, setEditedCriteria] = useState({});

  // Initialize editable names for custom rubric (selectedRubric === 4)
  useEffect(() => {
    if (selectedRubric === 4) {
      const initialEdited = {};
      rubrics[4].forEach(c => {
        initialEdited[c.id] = c.name;
      });
      setEditedCriteria(initialEdited);
    } else {
      setIsEditing(false);
      setEditedCriteria({});
    }
  }, [selectedRubric, rubrics]);

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => setIsEditing(false);

  const handleCriterionNameChange = (id, value) => {
    setEditedCriteria(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const criteriaList = selectedRubric === 4
    ? rubrics[4].map(criterion => ({
        ...criterion,
        name: editedCriteria[criterion.id] || criterion.name,
      }))
    : rubrics[selectedRubric];

  return (
    <div className="criteria-weights">
      

      <table>
        <thead>
          <tr>
            <th>CRITERIA</th>
            <th>WEIGHTS</th>
          </tr>
        </thead>
        <tbody>
          {criteriaList.map(criterion => (
            <tr key={criterion.id}>
              {/* CRITERIA COLUMN */}
              <td>
                {selectedRubric === 4 && isEditing ? (
                  <input
                    type="text"
                    value={editedCriteria[criterion.id]}
                    onChange={(e) => handleCriterionNameChange(criterion.id, e.target.value)}
                    disabled={settingsApplied}
                    className="criteria-name-input"
                    style={{ width: '100%' }}
                  />
                ) : (
                  <span>{criterion.name}</span>
                )}
              </td>

              {/* WEIGHTS COLUMN */}
              <td>
                <input
                className="bold-text"
                  type="number"
                  min={weightMin}
                  max={100}
                  value={weights[criterion.id] ?? weightMin}
                  onChange={(e) => handleWeightChange(criterion.id, e.target.value)}
                  disabled={settingsApplied}
                /> <b>%</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="scale" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <label htmlFor="scale_choice" style={{ color: 'white', fontWeight: 'bold' }}>Select Scoring Scale:</label>
        <select id="scale_choice" name="scale_choice" required>
          <option value="1">5-point scale</option>
          <option value="2">20-point scale</option>
          <option value="5" selected>100-point scale</option>
          <option value="6">50-point scale</option>
        </select>
        {selectedRubric === 4 && !settingsApplied && (
          !isEditing ? (
            <button
              onClick={handleEditClick}
              className="button small edit-button"
              style={{
                padding: '2vh',
                fontSize: '0.95em',
                minWidth: 'auto',
                minHeight: 'auto',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'right',
              }}
            >
              Edit Criteria
            </button>
          ) : (
            <button
              onClick={handleSaveClick}
              className="button small save-button"
              style={{
                padding: '2vh',
                fontSize: '0.95em',
                minWidth: 'auto',
                minHeight: 'auto',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'right',
              }}
            >
              Save Criteria
            </button>
          )
        )}
      </div>


      <div className="weight-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          className="reset-weights" 
          onClick={resetWeights}
          disabled={settingsApplied}
        >
          Reset Weights
        </button>
        <span className="total-weight"><b>Total: {totalWeight}/100%</b></span>
      </div>    
      
      <div className="apply-settings-container">
        <button 
          className="apply-settings" 
          onClick={handleApplySettings}
          disabled={settingsApplied || totalWeight !== 100}
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
};

export default CriteriaWeights;
