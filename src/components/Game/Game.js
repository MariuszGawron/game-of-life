import React, { useState, useEffect, useCallback, useMemo } from "react";
import GameCanvas from "./GameCanvas";

// Funkcja do tworzenia losowej siatki
const createGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0)));
};

// Funkcja do czyszczenia siatki
const clearGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
};

// Funkcja do tworzenia siatki z licznikami generacji
const createGenerationCountsGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
};

// Funkcja do zmiany wielkości siatki
const resizeGrid = (oldGrid, newRows, newCols) => {
  const newGrid = Array.from({ length: newRows }, (_, row) =>
    Array.from({ length: newCols }, (_, col) => (oldGrid[row] && oldGrid[row][col] !== undefined ? oldGrid[row][col] : 0))
  );
  return newGrid;
};

// Funkcja do zmiany wielkości siatki pomocniczej do liczenia przeżytych generacji
const resizeGenerationCountsGrid = (oldGrid, newRows, newCols) => {
  const newGrid = Array.from({ length: newRows }, (_, row) =>
    Array.from({ length: newCols }, (_, col) => (oldGrid[row] && oldGrid[row][col] !== undefined ? oldGrid[row][col] : 0))
  );
  return newGrid;
};

const Game = ({ rules }) => {
  const [grid, setGrid] = useState(() => createGrid(rules.gridHeight, rules.gridWidth));
  const [generationCountsGrid, setGenerationCountsGrid] = useState(() => createGenerationCountsGrid(rules.gridHeight, rules.gridWidth));
  const [isRunning, setIsRunning] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [generationsCount, setGenerationsCount] = useState(0);

  // Funkcja do przełączania stanu komórki
  const toggleCell = useCallback((row, col) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r, rowIndex) => r.map((c, colIndex) => (rowIndex === row && colIndex === col ? (c === 1 ? 0 : 1) : c)));
      return newGrid;
    });
    setGenerationCountsGrid((prevCounts) => {
      const newCounts = prevCounts.map((r, rowIndex) => r.map((c, colIndex) => (rowIndex === row && colIndex === col ? 0 : c)));
      return newCounts;
    });
  }, []);

  //Maksymalny próg, po którym nastąpi reset licznika dla komórki
  const getMaxThreshold = Math.max(...rules.colors.map((color) => color.threshold));

  // Funkcja generująca następną generację
  const nextGeneration = useCallback(
    (grid, birthRule, survivalRule) => {
      const newGrid = [];
      const newGenerationCountsGrid = [];
      const rows = grid.length;
      const cols = grid[0].length;

      // Pętla przez każdą komórkę, aby zliczyć sąsiadów
      for (let row = 0; row < rows; row++) {
        const newRow = [];
        const newCountRow = [];
        for (let col = 0; col < cols; col++) {
          const cell = grid[row][col];
          let neighbors = 0;

          // Pętla przez sąsiadów komórki
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              const x = row + i;
              const y = col + j;

              // Sprawdź, czy sąsiad jest w granicach siatki i dodaj jego stan do licznika
              if (x >= 0 && x < rows && y >= 0 && y < cols) {
                neighbors += grid[x][y];
              }
            }
          }

          // Użyj reguł gry w życie do ustalenia nowego stanu komórki
          if (cell === 1 && survivalRule.includes(neighbors)) {
            newRow.push(1);
            if (generationCountsGrid[row][col] >= getMaxThreshold) {
              newCountRow.push(1);
            } else {
              newCountRow.push(generationCountsGrid[row][col] + 1);
            }
          } else if (cell === 0 && birthRule.includes(neighbors)) {
            newRow.push(1);
            newCountRow.push(1);
          } else {
            newRow.push(0);
            newCountRow.push(0);
          }
        }
        newGrid.push(newRow);
        newGenerationCountsGrid.push(newCountRow);
      }

      setGenerationCountsGrid(newGenerationCountsGrid);
      return newGrid;
    },
    [generationCountsGrid]
  );

  //Rysowanie canvasa, bo przy obsłudze 10 000 divów przeglądarka miała ciężko
  const canvasComponent = useMemo(
    () => (
      <GameCanvas
        grid={grid}
        generationCountsGrid={generationCountsGrid}
        toggleCell={toggleCell}
        cellSize={rules.cellSize}
        setIsMouseDown={setIsMouseDown}
        isMouseDown={isMouseDown}
        colors={rules.colors}
        lines={rules.drawGridLines}
      />
    ),
    [grid, generationCountsGrid, toggleCell, rules.cellSize, isMouseDown, rules.colors, rules.drawGridLines]
  );

  // Generowanie następnych generacji
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setGenerationsCount((prevGenerationsCount) => prevGenerationsCount + 1);
        setGrid((prevGrid) => nextGeneration(prevGrid, rules.birthRule, rules.survivalRule));
      }, rules.timeTick);

      return () => clearInterval(interval);
    }
  }, [isRunning, nextGeneration, rules.birthRule, rules.timeTick, rules.survivalRule]);

  // Efekt używający zmiany rozmiaru siatki
  useEffect(() => {
    setGrid((prevGrid) => resizeGrid(prevGrid, rules.gridHeight, rules.gridWidth));
    setGenerationCountsGrid((prevGrid) => resizeGenerationCountsGrid(prevGrid, rules.gridHeight, rules.gridWidth));
  }, [rules.gridHeight, rules.gridWidth]);

  // Funkcja obsługująca kliknięcie przycisku "Następna generacja"
  const handleNextGeneration = () => {
    setGenerationsCount((prevGenerationsCount) => prevGenerationsCount + 1);
    setGrid((prevGrid) => nextGeneration(prevGrid, rules.birthRule, rules.survivalRule));
  };
  // Funkcja obsługująca kliknięcie przycisku "Losuj"
  const handleShuffle = () => {
    setGenerationsCount(0);
    setGrid(createGrid(rules.gridHeight, rules.gridWidth));
    setGenerationCountsGrid(createGenerationCountsGrid(rules.gridHeight, rules.gridWidth));
  };
  // Funkcja obsługująca kliknięcie przycisku "Czyść"
  const handleClear = () => {
    setGenerationsCount(0);
    setGrid(clearGrid(rules.gridHeight, rules.gridWidth));
    setGenerationCountsGrid(createGenerationCountsGrid(rules.gridHeight, rules.gridWidth));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "a":
          setIsRunning(!isRunning);
          break;
        case "s":
          handleShuffle();
          break;
        case "d":
          handleClear();
          break;
        case "f":
          handleNextGeneration();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsRunning, isRunning, handleShuffle, handleClear, handleNextGeneration]);

  // Renderowanie komponentu gry
  return (
    <div className="main-grid">
      <div className="flex">
        <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Stop" : "Start"}</button>
        <button onClick={handleShuffle}>Losuj</button>
        <button onClick={handleClear}>Czyść</button>
        <button onClick={handleNextGeneration}>Następna generacja</button>
        <span>Licznik generacji: {generationsCount}</span>
      </div>
      <div>{canvasComponent}</div>
    </div>
  );
};

export default Game;
