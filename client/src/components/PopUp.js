import React, { useEffect, useState } from 'react';

const PopUp = ({ 
  type, 
  message, 
  visible, 
  onClose, 
  autoHideDuration = 3000, 
  autoHide = false 
}) => {

  // Store dismissed error messages in state only (no persistence)
  const [dismissedErrors, setDismissedErrors] = useState([]);

  // Local checkbox state for current modal
  const [dontShowAgainChecked, setDontShowAgainChecked] = useState(false);

  // Reset checkbox whenever a new modal is shown or message changes
  useEffect(() => {
    if (visible && (type === 'error' || type === 'weight-warning')) {
      setDontShowAgainChecked(false);
    }
  }, [message, visible, type]);

  useEffect(() => {
    let timer;
    if (visible && autoHide) {
      timer = setTimeout(() => {
        if (onClose) onClose();
      }, autoHideDuration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, onClose, autoHide, autoHideDuration]);

  // Helper to uniquely identify error messages
  // If message is array, join to string; else use string itself
  const errorKey = Array.isArray(message) ? message.join('|') : message;

  const handleDontShowAgainChange = (e) => {
    const checked = e.target.checked;
    setDontShowAgainChecked(checked);
  };

  // If this is an error or weight-warning modal,
  // check if this specific message was dismissed before
  if ((type === 'error' || type === 'weight-warning') && dismissedErrors.includes(errorKey)) {
    // Already dismissed this specific message, skip showing modal
    if (onClose) onClose();
    return null;
  }

  // When user closes the modal, if "Don't show again" is checked, add this message to dismissed list
  const handleClose = () => {
    if (dontShowAgainChecked && (type === 'error' || type === 'weight-warning')) {
      setDismissedErrors(prev => [...prev, errorKey]);
    }
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <>
      {type === 'error' && (
        <div className="overlay">
          <div className="modal-container">
            <div className="modal-header">
              <img src={process.env.PUBLIC_URL + "/img/navbar-logo.png"} alt="Logo" style={{ height: "40px", width: "50px" }} className="mr-2" />
              <span className="modal-title">Oops!</span>
              <span className="close" onClick={handleClose}>X</span>
            </div>
            <div className="modal-body">
              {Array.isArray(message) ? (
                message.map((msg, index) => <p key={index}>{msg}</p>)
              ) : (
                <p>{message}</p>
              )}
              <div className="checkbox-wrapper-13" style={{ marginTop: '5vh', marginBottom: '1vh', color: 'gray', display: 'flex', alignItems: 'center' }}>
                <input
                  id="dont-show-again-error"
                  type="checkbox"
                  checked={dontShowAgainChecked}
                  onChange={handleDontShowAgainChange}
                />
                <label htmlFor="dont-show-again-error">Don’t show again</label>
              </div>
            </div>
            <button className="close-btn" onClick={handleClose}>Ok</button>
          </div>
        </div>
      )}

      {type === 'weight-warning' && (
        <div className="overlay">
          <div className="modal-container">
            <div className="modal-header">
              <img src={process.env.PUBLIC_URL + "/img/navbar-logo.png"} alt="Logo" style={{ height: "50px", width: "70px" }} className="mr-2" />
              <span className="modal-title">Oops!</span>
              <span className="close" onClick={handleClose}>X</span>
            </div>
            <div className="modal-body">
              <p>Total weights must equal exactly 100%.</p>
              <p>Please adjust your rubric weights.</p>
              <div className="checkbox-wrapper-13" style={{ marginTop: '5vh', marginBottom: '1vh', color: 'black', display: 'flex', alignItems: 'center' }}>
                <input
                  id="dont-show-again-weight-warning"
                  type="checkbox"
                  checked={dontShowAgainChecked}
                  onChange={handleDontShowAgainChange}
                />
                <label htmlFor="dont-show-again-weight-warning">Don’t show again</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other modal types unchanged */}
      {type === 'loading' && (
        <div className="overlay">
          <div className="modal-container">
            <div className="modal-header">
              <img src={process.env.PUBLIC_URL + "/img/navbar-logo.png"} alt="Logo" style={{ height: "50px", width: "70px" }} className="mr-2" />
              <span className="modal-title">Wait...</span>
              <span className="close" onClick={onClose}>X</span>
            </div>
            <div className="modal-body">
              <p>Applying settings...</p>
              <p>Do not exit the site...</p>
            </div>
          </div>
        </div>
      )}

      {type === 'grading' && (
        <div className="overlay">
          <div className="modal-container">
            <div className="modal-header">
              <img src={process.env.PUBLIC_URL + "/img/navbar-logo.png"} alt="Logo" style={{ height: "50px", width: "70px" }} className="mr-2" />
              <span className="modal-title">Please wait...</span>
              <span className="close" onClick={onClose}>X</span>
            </div>
            <div className="modal-body">
              <p>Grading your essays.</p>
              <p>Do not exit the site...</p>
              <p>If you are grading a batch file (.csv), your results will be automatically downloaded when grading is complete.</p>
            </div>
          </div>
        </div>
      )}

-      {type === 'grading-csv' && (
        <div className="overlay">
          <div className="modal-container">
            <div className="modal-header">
              <img src={process.env.PUBLIC_URL + "/img/navbar-logo.png"} alt="Logo" style={{ height: "50px", width: "70px" }} className="mr-2" />
              <span className="modal-title">Grading your essays.</span>
              <span className="close" onClick={onClose}>X</span>
            </div>
            <div className="modal-body">
              <p>Grading essay</p>               
              <p>out of</p> {/* before here should be the number of essay graded */}
              <p>essays.</p> {/* before here should be the total number of essays */}
            </div>
          </div>
        </div>
      )}

      {/* Success notification */}
      {type === 'success' && (
        <div className="success-popup fade-in-out">
          {message}
        </div>
      )}

      {/* File upload notification */}
      {type === 'file-uploaded' && (
        <div className="file-uploaded-message fade-in-out">
          {message}
        </div>
      )}
    </>
  );
};

export default PopUp;