import { useEffect } from "react";
import "./alert.css";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";

const Alert = ({ alertContent, alertClass, onCloseAlert }) => {
  useEffect(() => {
    const closeInterval = setTimeout(() => {
      onCloseAlert();
    }, 3500);

    //cleanup function
    return () => {
      clearTimeout(closeInterval);
    };
  });

  return (
    <div className={`alert ${alertClass}`}>
      <FaExclamationCircle size={16} className="icon-x" />
      <span className="msg">{alertContent}</span>
      <div className="close-btn" onClick={onCloseAlert}>
        <FaTimes size={18} className="icon-x" />
      </div>
    </div>
  );
};

export default Alert;
