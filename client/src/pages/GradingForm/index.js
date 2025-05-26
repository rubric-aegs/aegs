// src/components/GradingForm/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import PopupContainer from '../../components/PopUpContainer';
import InputSelector from './InputSelector';
import TextInput from './TextInput';
import FileUpload from './FileUpload';
import RubricSelector from './RubricSelector';
import CriteriaWeights from './CriteriaWeights';
import ActionButtons from './ActionButtons';
import { RUBRICS } from './constants';
import '../../assets/css/GradingForm.css';

function GradingForm() {
  const navigate = useNavigate();
  
  // Main state variables
  const [inputMethod, setInputMethod] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [essayText, setEssayText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedRubric, setSelectedRubric] = useState(2);
  const [weights, setWeights] = useState({});
  const [isGrading, setIsGrading] = useState(false);
  const [gradingComplete, setGradingComplete] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [settingsApplied, setSettingsApplied] = useState(false);
  const [customRubric, setRubrics] = useState([]);
  
  // Popup states
  const [fileUploadedMessage, setFileUploadedMessage] = useState(null);
  const [fileUploadedVisible, setFileUploadedVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [GradingVisible, setGradingVisible] = useState(false);
  const [weightWarningVisible, setWeightWarningVisible] = useState(false);

  // Initialize weights whenever rubric changes
  useEffect(() => {
    const initialWeights = {};
    document.title = "Grade Now";
    RUBRICS[selectedRubric].forEach(criterion => {
      initialWeights[criterion.id] = 0;
    });
    setWeights(initialWeights);
  }, [selectedRubric, customRubric]);
  
  // Handle popup close functions
  const handleFileUploadedClose = () => setFileUploadedVisible(false);
  const handleSuccessClose = () => setSuccessVisible(false);
  const handleErrorClose = () => setErrorVisible(false);
  const handleLoadingClose = () => setLoadingVisible(false);
  const handleGradingClose = () => setGradingVisible(false);
  const handleWeightWarningClose = () => setWeightWarningVisible(false);

  // Handle input method change
  const handleInputMethodChange = (method) => {
    if (settingsApplied) return;
    setInputMethod(method);
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (settingsApplied) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    if (essayText) {
      setErrorMessage(["You cannot upload a file because you've provided the essay content."]);
      setErrorVisible(true);
      e.target.value = null;
      return;
    }
    
    if (
      file.name.endsWith('.csv') ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')
    ) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setFileUploadedMessage("File uploaded successfully!");
      setFileUploadedVisible(true);
    } else {
      setErrorMessage(['Unsupported File Format.', 'Only accepts CSV, PDF, or DOC/DOCX files.']);
      setErrorVisible(true);
      e.target.value = null;
    }    
  };
  
  // Clear uploaded file
  const handleClearUploadedFile = () => {
    if (settingsApplied) return;
    setUploadedFileName(null);
    setUploadedFile(null);
  };

  // Get weight minimum based on selected rubric
  const getWeightMin = () => selectedRubric === 4 || selectedRubric === 'custom' ? 0 : 1;

  // Handle weight change
  const handleWeightChange = (criterionId, value) => {
    if (settingsApplied) return;
  
    // Only allow numbers, and disallow leading zeros except for 0 itself
    let newValue = value.replace(/^0+(?=\d)/, ''); // Remove leading zeros except single 0
  
    // Convert to integer
    let parsedValue = parseInt(newValue, 10);
  
    // If not a number, set to 0
    if (isNaN(parsedValue)) parsedValue = 0;
  
    // Apply min logic based on rubric
    const min = getWeightMin();
    if (parsedValue < min) parsedValue = min;
  
    // Calculate what the new total would be if this change is applied
    const currentTotal = Object.entries(weights).reduce(
      (sum, [id, w]) => sum + (id === criterionId ? 0 : (parseInt(w, 10) || 0)),
      0
    );
    const newTotal = currentTotal + parsedValue;
  
    if (newTotal > 100) {
      setWeightWarningVisible(true);
      return;
    }
  
    setWeights(prev => ({
      ...prev,
      [criterionId]: parsedValue
    }));
  };  
  
  // Handle rubric selection
  const handleRubricChange = (rubricNumber) => {
    if (settingsApplied) return;
    setSelectedRubric(rubricNumber);
  };
  
  // Reset weights to default (all equal)
  const resetWeights = () => {
    if (settingsApplied) return;
    const resetWeights = {};
    if (selectedRubric === 'custom') {
      customRubric.forEach(criterion => {
        resetWeights[criterion.id] = 0;
      });
    } else {
      RUBRICS[selectedRubric].forEach(criterion => {
        resetWeights[criterion.id] = 0;
      });
    }
    setWeights(resetWeights);
  };

  // Calculate total weight
  const calculateTotalWeight = () => {
    return Object.values(weights).reduce((sum, w) => sum + (parseInt(w, 10) || 0), 0);
  };

  const handleCustomCriterionNameChange = (criterionId, newName) => {
  setRubrics(prevRubrics => ({
    ...prevRubrics,
    custom: prevRubrics.custom.map(c =>
      c.id === criterionId ? { ...c, name: newName } : c
    )
  }));
};

  
  // Validate inputs before submission
  const validateInputs = () => {
    let errors = [];
    
    if (inputMethod === 'text') {
      if (!prompt.trim()) {
        errors.push('Missing writing prompt.');
      }
      
      if (!essayText.trim()) {
        errors.push('Missing essay text.');
      }
    } else {
      if (!uploadedFileName) {
        errors.push('Please upload a file.');
      }
    }

    // New validation for weights depending on rubric:
    if (selectedRubric === 1 || selectedRubric === 2 || selectedRubric === 3) {
      // Rubric A, B, or C: ALL criteria must have weights > 0
      const criteria = RUBRICS[selectedRubric];
      const missingWeights = criteria.filter(c => !weights[c.id] || parseInt(weights[c.id], 10) <= 0);
      if (missingWeights.length > 0) {
        errors.push('All criteria must have input weights for Rubric A, B, or C.');
      }
    } else if (selectedRubric === 4) {
      // Custom rubric: at least 3 criteria must have weights > 0
      const positiveWeightsCount = Object.values(weights).filter(w => parseInt(w, 10) > 0).length;
      if (positiveWeightsCount < 3) {
        errors.push('At least 3 criteria must have input weights in the custom rubric.');
      }
    }
    
    if (errors.length > 0) {
      setErrorMessage(errors);
      setErrorVisible(true);
      return false;
    }
    
    return true;
  };
  
  // Apply settings
  const handleApplySettings = () => {
    if (settingsApplied) return;
    
    // Calculate total weights
    const totalWeight = calculateTotalWeight();
    
    // Check if total is exactly 100 (except for custom rubric where we allow some zeros)
    if (totalWeight !== 100) {
      if (selectedRubric === 4) {
        // For custom rubric, weights > 0 must sum to 100
        const nonZeroWeights = Object.values(weights).filter(w => w > 0);
        const nonZeroTotal = nonZeroWeights.reduce((sum, w) => sum + w, 0);
        if (nonZeroTotal !== 100) {
          setWeightWarningVisible(true);
          return;
        }
      } else {
        // For Rubrics A/B/C, total must be 100
        setWeightWarningVisible(true);
        return;
      }
    }
    
    // Validate inputs including new weight rules
    if (validateInputs()) {
      setLoadingVisible(true);
      
      // Simulate processing time
      setTimeout(() => {
        setLoadingVisible(false);
        setSettingsApplied(true);
        setSuccessMessage('Settings applied successfully!');
        setSuccessVisible(true);
      }, 2000);
    }
  };

const handleSubmitGrading = async () => {
  if (!settingsApplied) {
    setErrorMessage(['Please apply settings first before grading.']);
    setErrorVisible(true);
    return;
  }

  setIsGrading(true);
  setGradingVisible(true);

  try {
    let response;
    let result;

    if (inputMethod === 'text') {
      const requestData = {
        prompt: prompt,
        essay_text: essayText,
        weights: weights,
        rubric_choice: selectedRubric,
      };

      console.log("Sending request:", requestData);

      response = await fetch('/api/evaluate/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
    } else {
      const fileName = uploadedFile?.name?.toLowerCase();
      if (!fileName) throw new Error("No uploaded file detected.");

      const isCSV = fileName.endsWith('.csv');
      const isDoc = fileName.endsWith('.doc') || fileName.endsWith('.docx');
      const isPDF = fileName.endsWith('.pdf');

      // Create appropriate endpoint based on file type
      let endpoint = '/api/upload';  // Use a common endpoint
      
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('weights', JSON.stringify(weights));
      formData.append('rubric_choice', selectedRubric);
      
      // Add file type as a parameter
      if (isCSV) formData.append('fileType', 'csv');
      else if (isDoc) formData.append('fileType', 'doc');
      else if (isPDF) formData.append('fileType', 'pdf');
      else throw new Error("Unsupported file format.");

      console.log("Uploading to endpoint:", endpoint);

      try {
        response = await fetch(endpoint, {
          method: 'POST',  // Make sure server accepts POST
          body: formData,
        });
      } catch (fetchError) {
        console.error('Network error during file grading:', fetchError);
        setGradingVisible(false);  // Close grading popup
        setErrorMessage(['Network error occurred during grading. Please check your connection or server.']);
        setErrorVisible(true);
        setIsGrading(false);  // Reset grading state
        return;
      }
    }

    if (!response || !response.ok) {
      const errorData = await response?.json().catch(() => null);
      console.error("Server error response:", errorData || response?.statusText);
      throw new Error(`HTTP error! status: ${response?.status}`);
    }

    // Handle the response based on content type
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // This is a JSON response (single essay results)
      const results = await response.json();
      if (!results.weights) results.weights = weights;

      localStorage.setItem('gradingResults', JSON.stringify(results));
      setGradingComplete(true);
      setGradingVisible(false);  // Close grading popup
      setSuccessMessage('Grading completed successfully!');
      setSuccessVisible(true);

      setTimeout(() => navigate('/grading-results'), 1500);
    } else {
      // This is a file download (CSV processing)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `graded_${uploadedFile?.name || 'file'}`;
      localStorage.setItem('gradingResults', JSON.stringify({ type: 'csv' }));
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setGradingComplete(true);
      setGradingVisible(false);  // Close grading popup
      setSuccessMessage('CSV processing complete! The scored file has been downloaded.');
      setSuccessVisible(true);

      setTimeout(() => {
        setSuccessMessage('Grading complete! You will now be redirected to Home tab.');
        setSuccessVisible(true);
        setTimeout(() => navigate('/home'), 1000);
      }, 4000);
    }
  } catch (error) {
    console.error('Error during grading:', error);
    setGradingVisible(false);  // Close grading popup
    setErrorMessage(['Error during grading process:', error.message]);
    setErrorVisible(true);
    setIsGrading(false);  // Reset grading state
  }
};
  // View results (enabled only when grading is complete)
  const viewResults = () => {
    if (gradingComplete) {
      navigate('/grading-results');
    } else {
      setErrorMessage(['Complete grading first before viewing results.']);
      setErrorVisible(true);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <PopupContainer 
        fileUploadedMessage={fileUploadedMessage}
        fileUploadedVisible={fileUploadedVisible}
        onFileUploadedClose={handleFileUploadedClose}
        successMessage={successMessage}
        successVisible={successVisible}
        onSuccessClose={handleSuccessClose}
        errorMessage={errorMessage}
        errorVisible={errorVisible}
        onErrorClose={handleErrorClose}
        loadingVisible={loadingVisible}
        onLoadingClose={handleLoadingClose}
        onGradingClose={handleGradingClose}
        GradingVisible={GradingVisible}
        weightWarningVisible={weightWarningVisible}
        onWeightWarningClose={handleWeightWarningClose}
      />
      
      <div className="grade-now-container flex flex-row items-start justify-center mt-8 mb-8">
        <div className="left-content w-1/2 pr-8">
          <h1 className="mb-8">RUBRIC-BASED AUTOMATED ESSAY GRADING SYSTEM</h1>
          
          <InputSelector 
            inputMethod={inputMethod} 
            handleInputMethodChange={handleInputMethodChange}
            settingsApplied={settingsApplied}
          />
          
          <div className="mt-8">
            {inputMethod === 'text' ? (
              <TextInput 
                prompt={prompt}
                setPrompt={setPrompt}
                essayText={essayText}
                setEssayText={setEssayText}
                settingsApplied={settingsApplied}
              />
            ) : (
              <FileUpload 
                uploadedFileName={uploadedFileName}
                handleFileChange={handleFileChange}
                handleClearUploadedFile={handleClearUploadedFile}
                settingsApplied={settingsApplied}
              />
            )}
          </div>
        </div>
        
        <div className="right-content w-1/2 pl-8 rubric">
          <RubricSelector 
            selectedRubric={selectedRubric}
            handleRubricChange={handleRubricChange}
            settingsApplied={settingsApplied}
          />
          
          <div className="mt-8">
            <CriteriaWeights 
              rubrics={RUBRICS}
              selectedRubric={selectedRubric}
              weights={weights}
              handleWeightChange={handleWeightChange}
              resetWeights={resetWeights}
              calculateTotalWeight={calculateTotalWeight}
              handleApplySettings={handleApplySettings}
              settingsApplied={settingsApplied}
              weightMin={getWeightMin()}
            />
          </div>
        </div>
      </div>
      
      <ActionButtons 
        isGrading={isGrading}
        gradingComplete={gradingComplete}
        settingsApplied={settingsApplied}
        handleSubmitGrading={handleSubmitGrading}
        viewResults={viewResults}
      />
    </div>
  );
}

export default GradingForm;