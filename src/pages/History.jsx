import React from "react";
import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";

function History() {
  const history = JSON.parse(localStorage.getItem("gameHistory")) || [];

  return (
    <>
      <Header />

      <div className="history-page">
        <h1>🎮 Match History</h1>

        {history.length === 0 ? (
          <p>No Games Played Yet</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-card">
              <h3>{item.result}</h3>

              <p>Time: {item.time}s</p>

              <p>Date: {item.date}</p>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}

export default History;
