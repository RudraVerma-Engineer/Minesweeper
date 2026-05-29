import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.email === email && storedUser?.password === password) {
      localStorage.setItem("isLoggedIn", true);
      navigate("/game");
    } else {
      alert("Invalid Credentials");
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-card">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p>
          Don't have account?
          <Link to="/signup"> Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
