import { useNavigate } from "react-router-dom";
import "./BackButton.css";

function BackButton({ fallback = "/", className = "" }) {
  const navigate = useNavigate();

  // If the page was opened directly (shared link, new tab) there is no
  // in-app history, and navigate(-1) would leave the site — go home instead.
  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button type='button' onClick={goBack} className={`back-btn ${className}`}>
      ← Back
    </button>
  );
}

export default BackButton;
