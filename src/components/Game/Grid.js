import React from "react";
import Cell from "./Cell";

const Grid = ({ grid, toggleCell }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => <Cell key={`${rowIndex}-${colIndex}`} isAlive={cell} toggleCell={() => toggleCell(rowIndex, colIndex)} />)
      )}
    </div>
  );
};

export default Grid;
