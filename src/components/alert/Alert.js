import React from "react";
import "./alert.css";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";

const Alert = () => {
  return (
    <div className="alert">
      <FaExclamationCircle size={16} className="icon-x" />
      <span className="msg">Please Enter a Task and Date</span>
      <div className="close-btn">
        <FaTimes size={18} className="icon-x" />
      </div>
    </div>
  );
};

export default Alert;
