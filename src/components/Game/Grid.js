import React from "react";
import Cell from "./Cell";

const Grid = ({ cells, toggleCell, cellSize, isMouseDown, setIsMouseDown }) => {
  return (
    <div
      className="grid"
      style={{ display: "flex", gridTemplateColumns: `repeat(${cells[0].length}, ${cellSize}px)`, justifyContent: "center" }}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} cellSize={cellSize} isAlive={cell === 1} toggleCell={() => toggleCell(rowIndex, cellIndex)} isMouseDown={isMouseDown} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
