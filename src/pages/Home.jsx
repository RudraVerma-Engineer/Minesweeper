import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <h1>💣 Minesweeper Arena</h1>

      <Link to="/login">
        <button>Start Game</button>
      </Link>
    </div>
  );
}

export default Home;
