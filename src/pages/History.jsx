// History.jsx

import React from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
import "../styles/history.css";
import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";

function History() {
  const history = JSON.parse(localStorage.getItem("gameHistory")) || [];

  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <>
      <Header />

      <div className="history-container">
        <h1 className="history-title">🎮 Game History</h1>

        {history.length === 0 ? (
          <div className="empty-history">
            <p>No games played yet 🚀</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>User</th>
                  <th>Result</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{user.username || "Player"}</td>

                    <td
                      className={item.result.includes("Won") ? "win" : "lose"}
                    >
                      {item.result}
                    </td>

                    <td>{item.time}s</td>

                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default History;
