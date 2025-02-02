import React, { useState } from "react";
import { registerUser } from "../controllers/authCon";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = { username, email, password };
    const response = await registerUser(userInfo);
    console.log("Registering user:", userInfo);
    if (response.success === true) {
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form register-form">
        <div className="form_title">Create Account</div>
        <form className="registration-form">
          <div className="input_fields">
            <input
              className="input-box"
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input-box"
              type="email"
              placeholder="Enter E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input-box"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-button" onClick={handleSubmit}>
            <button type="Submit">Register</button>
          </div>
        </form>
        <div className="login-link">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
