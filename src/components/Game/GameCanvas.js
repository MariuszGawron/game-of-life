import React, { useRef, useEffect, useCallback, useState } from "react";

const GameCanvas = ({ grid, generationCountsGrid, cellSize, toggleCell, setIsMouseDown, isMouseDown, colors, lines }) => {
  const canvasRef = useRef(null);
  const [changedCells, setChangedCells] = useState(new Set());

  const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const rgbToHex = (rgb) => {
    return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).toUpperCase()}`;
  };

  const getColor = (generationsCount) => {
    if (!colors || colors.length === 0) return "black"; // Domyślny kolor, jeśli brak danych

    // Sortuj kolory według progu
    const sortedColors = colors.slice().sort((a, b) => a.threshold - b.threshold);

    // Znajdź odpowiednie kolory do interpolacji
    let lowerColor = sortedColors[0];
    let upperColor = sortedColors[sortedColors.length - 1];

    for (let i = 0; i < sortedColors.length - 1; i++) {
      if (generationsCount >= sortedColors[i].threshold && generationsCount < sortedColors[i + 1].threshold) {
        lowerColor = sortedColors[i];
        upperColor = sortedColors[i + 1];
        break;
      }
    }

    // Oblicz współczynnik interpolacji
    const factor = (generationsCount - lowerColor.threshold) / (upperColor.threshold - lowerColor.threshold);

    const lowerRgb = hexToRgb(lowerColor.color);
    const upperRgb = hexToRgb(upperColor.color);

    const interpolatedRgb = interpolateColor(lowerRgb, upperRgb, factor);
    return rgbToHex(interpolatedRgb);
  };

  // Funkcja rysująca siatkę
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rows = grid.length;
    const cols = grid[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = grid[row][col] ? getColor(generationCountsGrid[row][col]) : "white";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }, [grid, cellSize, generationCountsGrid, colors]);

  // Funkcja rysująca linie siatki
  const drawGridLines = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rows = grid.length;
    const cols = grid[0].length;

    ctx.strokeStyle = "#ccc"; // Kolor linii siatki

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }, [grid.length, grid[0].length, cellSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ustaw rozmiar canvas
    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;

    drawGrid();
    if (lines) {
      drawGridLines();
    }
  }, [grid, cellSize, drawGrid, drawGridLines, lines]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    toggleCell(row, col);
    setChangedCells(new Set([`${row},${col}`])); // Reset changed cells
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setChangedCells(new Set()); // Reset changed cells
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const row = Math.floor(y / cellSize);
      const col = Math.floor(x / cellSize);
      const cellKey = `${row},${col}`;

      if (!changedCells.has(cellKey)) {
        toggleCell(row, col);
        setChangedCells((prev) => new Set(prev).add(cellKey));
      }
    }
  };

  return <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} />;
};

export default GameCanvas;
