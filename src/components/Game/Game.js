import React, { useState, useEffect } from "react";
import Grid from "./Grid";

const createGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0)));
};

const Game = ({ rules }) => {
  const [grid, setGrid] = useState(createGrid(rules.gridSize, rules.gridSize));
  const [isRunning, setIsRunning] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const toggleCell = (row, col) => {
    const newGrid = grid.map((r, rowIndex) => r.map((c, colIndex) => (rowIndex === row && colIndex === col ? (c === 1 ? 0 : 1) : c)));
    setGrid(newGrid);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setGrid((prev) => nextGeneration(prev, rules.birthRule, rules.survivalRule));
      }, rules.timeTick); // Ustawienie interwału z rules.timeTick
      return () => clearInterval(interval);
    }
  }, [isRunning, rules.timeTick, rules.birthRule, rules.survivalRule]); // Aktualizacja rules.timeTick, rules.birthRule i rules.survivalRule zmian zasad

  //Następna generacja - generowanie kolejnego widoku planszy
  const nextGeneration = (grid, birthRule, survivalRule) => {
    const newGrid = [];
    const rows = grid.length;
    const cols = grid[0].length;

    //Pętla przez każdą komórkę, żeby zliczyć ilość sąsiadów
    for (let row = 0; row < rows; row++) {
      const newRow = [];
      for (let col = 0; col < cols; col++) {
        const cell = grid[row][col];
        //licznik sąsiadów
        let neighbors = 0;
        //-1 to sąsiad z lewej lub nad, 1 to sąsiad z prawej lub pod
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const x = row + i;
            const y = col + j;
            //sprawdz czy sąsiad jest w granicach siatki i dodaje stan sąsiada do licznika
            if (x >= 0 && x < rows && y >= 0 && y < cols) {
              neighbors += grid[x][y];
            }
          }
        }
        // Użyj dynamicznych reguł do ustalenia nowego stanu komórki
        if (cell === 1 && !survivalRule.includes(neighbors)) {
          newRow.push(0);
        } else if (cell === 0 && birthRule.includes(neighbors)) {
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
      <button onClick={() => setGrid(createGrid(rules.gridSize, rules.gridSize))}>Reset</button>
      <Grid cells={grid} toggleCell={toggleCell} cellSize={rules.cellSize} setIsMouseDown={setIsMouseDown} isMouseDown={isMouseDown} />
    </div>
  );
};

export default Game;
