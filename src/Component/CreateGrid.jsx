import React, { useState } from "react";
import "../styles/game.css";

const rows = 8;
const cols = 8;
const minesCount = 10;

// 🔹 Create empty grid
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

// 🔹 Place mines (safe zone)
function placeMines(grid, safeRow, safeCol) {
    let minesPlaced = 0;

    while (minesPlaced < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        const isSafeZone = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;

        if (isSafeZone || grid[r][c].isMine) continue;

        grid[r][c].isMine = true;
        minesPlaced++;
    }

    return grid;
}

// 🔹 Calculate numbers
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
                let nr = r + dr;
                let nc = c + dc;

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

// 🔹 Flood fill
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

    while (stack.length) {
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

// 🔹 Check win
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

// 🔹 Number colors
function getColor(value) {
    const colors = {
        1: "blue",
        2: "green",
        3: "red",
        4: "purple",
        5: "brown",
        6: "cyan",
        7: "black",
        8: "gray",
    };
    return colors[value] || "black";
}

// 🔹 Cell component
function Cell({ cell, onReveal, onFlag }) {
    return (
        <div
            className={`cell ${cell.isRevealed ? "revealed" : ""}`}
            onClick={() => onReveal(cell.row, cell.col)}
            onContextMenu={(e) => {
                e.preventDefault();
                onFlag(cell.row, cell.col);
            }}
            style={{ color: getColor(cell.value) }}
        >
            {renderContent(cell)}
        </div>
    );
}

// 🔹 Render content
function renderContent(cell) {
    if (cell.isWrong) return "❌";
    if (cell.isFlagged) return "🚩";
    if (!cell.isRevealed) return "";
    if (cell.isMine) return "💣";
    if (cell.value > 0) return cell.value;
    return " .";
}

// 🔹 Main Component
function CreateGrid() {
    const [grid, setGrid] = useState(createEmptyGrid());
    const [firstClick, setFirstClick] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    function handleReveal(row, col) {
        if (gameOver || gameWon) return;

        let newGrid = grid.map((r) => r.map((c) => ({ ...c })));

        // First click setup
        if (firstClick) {
            newGrid = placeMines(newGrid, row, col);
            newGrid = calculateValues(newGrid);
            setFirstClick(false);
        }

        const cell = newGrid[row][col];

        if (cell.isRevealed || cell.isFlagged) return;

        // 💣 Game Over
        if (cell.isMine) {
            setGameOver(true);

            const updatedGrid = newGrid.map((row) =>
                row.map((c) => {
                    if (c.isMine) return { ...c, isRevealed: true };
                    if (c.isFlagged && !c.isMine) return { ...c, isWrong: true };
                    return c;
                })
            );

            setGrid(updatedGrid);

            setTimeout(() => {
                alert("Game Over 💥");
            }, 100);

            return;
        }

        // 🌊 Reveal cells
        newGrid = revealCells(newGrid, row, col);

        // 🏆 Win check
        if (checkWin(newGrid)) {
            setGameWon(true);

            setTimeout(() => {
                alert("You Won 🎉");
            }, 100);
        }

        setGrid(newGrid);
    }

    function handleFlag(row, col) {
        if (gameOver || gameWon) return;

        const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
        const cell = newGrid[row][col];

        if (cell.isRevealed) return;

        cell.isFlagged = !cell.isFlagged;
        setGrid(newGrid);
    }

    // 🔁 Restart
    function handleRestart() {
        setGrid(createEmptyGrid());
        setFirstClick(true);
        setGameOver(false);
        setGameWon(false);
    }

    return (
        <div>
            <button onClick={handleRestart} className="restart-btn">
                Restart 🔁
            </button>

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
        </div>
    );
}

export default CreateGrid;
