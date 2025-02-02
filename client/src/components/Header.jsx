import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "../controllers/authCon";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        console.log("Logged out successfully");
        navigate("/login");
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleVisit = () => {
    window.location.href = "https://testline.in";
  };

  return (
    <div className="header-container">
      <div className="icon-box">
        <div className="logo-img">
          <img src={logo} alt="TestLine" />
        </div>
        <div className="site-btn">
          <button onClick={handleVisit}>Visit TestLine</button>
        </div>
        <div className="logout-btn">
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="download-app">
          <div className="download-app-icon">
            <FontAwesomeIcon icon={faDownload} />
          </div>
          <div className="download-app-text">
            <a href="https://play.google.com/store/apps/developer?id=Testline">
              Download APP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
