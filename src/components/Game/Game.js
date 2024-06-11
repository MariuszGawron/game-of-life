import React, { useState, useEffect } from "react";
import Grid from "./Grid";

const createGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0)));
};

const Game = () => {
  const [grid, setGrid] = useState(createGrid(20, 20));
  const [isRunning, setIsRunning] = useState(false);

  const toggleCell = (row, col) => {
    const newGrid = grid.map((r, rowIndex) => r.map((c, colIndex) => (rowIndex === row && colIndex === col ? 1 - c : c)));
    setGrid(newGrid);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setGrid((prev) => nextGeneration(prev));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const nextGeneration = (grid) => {
    // Implementacja reguł gry w życie
    // Zwraca nową siatkę
  };

  return (
    <div>
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Stop" : "Start"}</button>
      <button onClick={() => setGrid(createGrid(20, 20))}>Reset</button>
      <Grid grid={grid} toggleCell={toggleCell} />
    </div>
  );
};

export default Game;
