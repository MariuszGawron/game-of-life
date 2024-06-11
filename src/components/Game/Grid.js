import React from "react";
import Cell from "./Cell"; // Upewnij się, że ścieżka jest poprawna

const Grid = ({ cells, toggleCell }) => {
  // Upewnij się, że cells jest zainicjowane jako tablica
  if (!cells || cells.length === 0) {
    return <p>Loading...</p>; // Lub inny komunikat, który chcesz wyświetlić
  }

  return (
    <div>
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} isAlive={cell === 1} toggleCell={() => toggleCell(rowIndex, cellIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
