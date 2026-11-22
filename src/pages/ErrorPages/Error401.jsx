import React from "react";
import "./Error401.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import AccessImage from "../../assets/access-denied-5627546-4694106.webp";

const Error401 = () => {
  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate("/users");
  };

  return (
    <div className="main_container">
      <img src={AccessImage} alt="Access Denied" className="error_image" />
      <div className="main_box">
        <div className="error_heading">
          Access Restricted to User Page
        </div>
        <p className="text-muted my-4">
          Your access is limited to the user page. Please check your permissions if you believe this is an error.
        </p>
      </div>
      <div className="back_button">
        <Button
          label="Back to User Page"
          severity="info"
          style={{ borderRadius: "5px", height: "45px" }}
          onClick={navigateToDashboard}
        />
      </div>
    </div>
  );
};

export default Error401;
