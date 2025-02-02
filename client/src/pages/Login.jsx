import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../controllers/authCon";
import "./Register.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = { username, password };
    const response = await loginUser(userInfo);
    if (response.success === true) {
      navigate("/home");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form login-form">
        <div className="form_title">Login</div>
        <form>
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
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button">
            <button type="Submit" onClick={handleSubmit}>
              Login
            </button>
          </div>
        </form>
        <div className="regiter-link">
          <Link to="/">Don't have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
