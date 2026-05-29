// CreateGrid.jsx

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
import "../styles/game.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const rows = 8;
const cols = 8;
const minesCount = 10;

// ================= CREATE EMPTY GRID =================
function createEmptyGrid() {
  let grid = [];

  for (let r = 0; r < rows; r++) {
    let row = [];

    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        value: 0,
        isRevealed: false,
        isFlagged: false,
        isWrong: false,
      });
    }

    grid.push(row);
  }

  return grid;
}

// ================= PLACE MINES =================
function placeMines(grid, safeRow, safeCol) {
  let minesPlaced = 0;

  while (minesPlaced < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    const isSafeZone = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;

    if (isSafeZone || grid[r][c].isMine) continue;

    grid[r][c].isMine = true;
    minesPlaced++;
  }

  return grid;
}

// ================= CALCULATE VALUES =================
function calculateValues(grid) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].isMine) continue;

      let count = 0;

      directions.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          grid[nr][nc].isMine
        ) {
          count++;
        }
      });

      grid[r][c].value = count;
    }
  }

  return grid;
}

// ================= REVEAL CELLS =================
function revealCells(grid, row, col) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const stack = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop();

    const cell = grid[r][c];

    if (cell.isRevealed || cell.isFlagged) continue;

    cell.isRevealed = true;

    if (cell.value === 0 && !cell.isMine) {
      directions.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          stack.push([nr, nc]);
        }
      });
    }
  }

  return grid;
}

// ================= CHECK WIN =================
function checkWin(grid) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];

      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }

  return true;
}

// ================= SAVE HISTORY =================
function saveGameHistory(result, time) {
  const history = JSON.parse(localStorage.getItem("gameHistory")) || [];

  history.unshift({
    result,
    time,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem("gameHistory", JSON.stringify(history));
}

// ================= NUMBER COLORS =================
function getColor(value) {
  const colors = {
    1: "#2563eb",
    2: "#16a34a",
    3: "#dc2626",
    4: "#7c3aed",
    5: "#f97316",
    6: "#06b6d4",
    7: "#111827",
    8: "#6b7280",
  };

  return colors[value] || "#111827";
}

// ================= CELL CONTENT =================
function renderContent(cell) {
  if (cell.isWrong) return "❌";
  if (cell.isFlagged) return "🚩";
  if (!cell.isRevealed) return "";
  if (cell.isMine) return "💣";
  if (cell.value > 0) return cell.value;

  return "";
}

// ================= CELL COMPONENT =================
function Cell({ cell, onReveal, onFlag }) {
  return (
    <div
      className={`cell 
            ${cell.isRevealed ? "revealed" : ""}
            ${cell.isMine && cell.isRevealed ? "mine" : ""}
            `}
      onClick={() => onReveal(cell.row, cell.col)}
      onContextMenu={(e) => {
        e.preventDefault();
        onFlag(cell.row, cell.col);
      }}
      style={{
        color: cell.isRevealed ? getColor(cell.value) : "white",
      }}
    >
      {renderContent(cell)}
    </div>
  );
}

// ================= MAIN COMPONENT =================
function CreateGrid() {
  const [grid, setGrid] = useState(createEmptyGrid());

  const [firstClick, setFirstClick] = useState(true);

  const [gameOver, setGameOver] = useState(false);

  const [gameWon, setGameWon] = useState(false);

  // TIMER
  const [time, setTime] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  // BEST SCORE
  const [bestScore, setBestScore] = useState(
    localStorage.getItem("bestScore") || null,
  );

  // TIMER EFFECT
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // FLAG COUNT
  const flaggedCount = grid.flat().filter((cell) => cell.isFlagged).length;

  const remainingMines = minesCount - flaggedCount;

  // ================= HANDLE REVEAL =================
  function handleReveal(row, col) {
    if (gameOver || gameWon) return;

    let newGrid = grid.map((r) => r.map((c) => ({ ...c })));

    // FIRST CLICK SAFE
    if (firstClick) {
      newGrid = placeMines(newGrid, row, col);

      newGrid = calculateValues(newGrid);

      setFirstClick(false);

      setIsRunning(true);
    }

    const cell = newGrid[row][col];

    if (cell.isRevealed || cell.isFlagged) return;

    // GAME OVER
    if (cell.isMine) {
      setGameOver(true);

      setIsRunning(false);

      saveGameHistory("Lost 💥", time);

      const updatedGrid = newGrid.map((row) =>
        row.map((c) => {
          if (c.isMine) {
            return {
              ...c,
              isRevealed: true,
            };
          }

          if (c.isFlagged && !c.isMine) {
            return {
              ...c,
              isWrong: true,
            };
          }

          return c;
        }),
      );

      setGrid(updatedGrid);

      setTimeout(() => {
        alert("Game Over 💥");
      }, 100);

      return;
    }

    // REVEAL
    newGrid = revealCells(newGrid, row, col);

    // WIN CHECK
    if (checkWin(newGrid)) {
      setGameWon(true);

      setIsRunning(false);

      saveGameHistory("Won 🎉", time);

      if (!bestScore || time < bestScore) {
        localStorage.setItem("bestScore", time);

        setBestScore(time);
      }

      setTimeout(() => {
        alert("You Won 🎉");
      }, 100);
    }

    setGrid(newGrid);
  }

  // ================= HANDLE FLAG =================
  function handleFlag(row, col) {
    if (gameOver || gameWon) return;

    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));

    const cell = newGrid[row][col];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;

    setGrid(newGrid);
  }

  // ================= RESTART =================
  function handleRestart() {
    setGrid(createEmptyGrid());

    setFirstClick(true);

    setGameOver(false);

    setGameWon(false);

    setTime(0);

    setIsRunning(false);
  }

  return (
    <>
      <Header/>

      <div className="game-container">
        {gameWon && <Confetti />}

        <h1 className="game-title">💣 Minesweeper</h1>

        {/* TOP BAR */}
        <div className="top-bar">
          <div className="info-card">⏱ {time}s</div>

          <div className="info-card">🚩 {remainingMines}</div>

          <div className="info-card">
            🏆 {bestScore ? `${bestScore}s` : "--"}
          </div>
        </div>

        <p className="game-status">
          {gameOver
            ? "Game Over 💥"
            : gameWon
              ? "You Won 🎉"
              : "Left Click → Reveal | Right Click → Flag 🚩"}
        </p>

        {/* GRID */}
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  onReveal={handleReveal}
                  onFlag={handleFlag}
                />
              ))}
            </div>
          ))}
        </div>

        {/* FLOATING RESTART */}
        <button className="floating-restart" onClick={handleRestart}>
          🔁 Restart
        </button>
      </div>

      <Footer />
    </>
  );
}

export default CreateGrid;
