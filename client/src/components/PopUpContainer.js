// src/components/PopupContainer.js
import React from "react";
import PopUp from "./PopUp";

const PopupContainer = ({
  fileUploadedMessage,
  fileUploadedVisible,
  onFileUploadedClose,
  successMessage,
  successVisible,
  onSuccessClose,
  errorMessage,
  errorVisible,
  onErrorClose,
  loadingVisible,
  onLoadingClose,
  GradingVisible,
  onGradingClose,
  weightWarningVisible,
  onWeightWarningClose,
}) => {
  return (
    <>
      <PopUp
        type="file-uploaded"
        message={fileUploadedMessage}
        visible={fileUploadedVisible}
        onClose={onFileUploadedClose}
        autoHide={true}
      />

      <PopUp
        type="success"
        message={successMessage}
        visible={successVisible}
        onClose={onSuccessClose}
        autoHide={true}
      />

      <PopUp
        type="error"
        message={errorMessage}
        visible={errorVisible}
        onClose={onErrorClose}
      />

      <PopUp
        type="loading"
        visible={loadingVisible && !errorVisible}
        onClose={onLoadingClose}
      />

      <PopUp
        type="grading"
        message="Grading in progress..."
        visible={GradingVisible}
        onClose={onGradingClose}
        autoHide={true}
        autoHideDuration={15000}
      />

      <PopUp
        type="weight-warning"
        message="The total weight does not equal 100%."
        visible={weightWarningVisible}
        onClose={onWeightWarningClose}
      />
    </>
  );
};

export default PopupContainer;