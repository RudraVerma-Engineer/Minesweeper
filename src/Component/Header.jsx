import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  }

  return (
    <header className="header">
      <h2>💣 Minesweeper</h2>

      <nav>
        <Link to="/game">Game</Link>
        <Link to="/history">History</Link>
      </nav>

      <div className="header-right">
        <span>{user?.username}</span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
