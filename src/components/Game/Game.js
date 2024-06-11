import React, { useState, useEffect } from "react";
import Grid from "./Grid";

const createGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0)));
};

const Game = ({ rules }) => {
  const [grid, setGrid] = useState(createGrid(20, 20));
  const [isRunning, setIsRunning] = useState(false);

  const toggleCell = (row, col) => {
    const newGrid = grid.map((r, rowIndex) => r.map((c, colIndex) => (rowIndex === row && colIndex === col ? (c === 1 ? 0 : 1) : c)));
    setGrid(newGrid);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setGrid((prev) => nextGeneration(prev));
      }, rules.timeTick); // Ustawienie interwału z rules.timeTick
      return () => clearInterval(interval);
    }
  }, [isRunning, rules.timeTick]); // Dodanie rules.timeTick do zależności useEffect

  const nextGeneration = (grid) => {
    const newGrid = [];
    const rows = grid.length;
    const cols = grid[0].length;

    for (let row = 0; row < rows; row++) {
      const newRow = [];
      for (let col = 0; col < cols; col++) {
        const cell = grid[row][col];
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const x = row + i;
            const y = col + j;
            if (x >= 0 && x < rows && y >= 0 && y < cols) {
              neighbors += grid[x][y];
            }
          }
        }
        if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
          newRow.push(0);
        } else if (cell === 0 && neighbors === 3) {
          newRow.push(1);
        } else {
          newRow.push(cell);
        }
      }
      newGrid.push(newRow);
    }
    return newGrid;
  };

  return (
    <div>
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Stop" : "Start"}</button>
      <button onClick={() => setGrid(createGrid(10, 10))}>Reset</button>
      <Grid cells={grid} toggleCell={toggleCell} />
    </div>
  );
};

export default Game;
