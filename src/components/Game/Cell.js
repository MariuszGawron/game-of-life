import React from "react";

const Cell = ({ isAlive, toggleCell, cellSize, isMouseDown }) => {
  const handleMouseOver = () => {
    if (isMouseDown) {
      toggleCell();
    }
  };
  return (
    <div
      className={`cell ${isAlive ? "alive" : ""}`}
      style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
      onMouseDown={toggleCell}
      onMouseOver={handleMouseOver}
    />
  );
};

export default Cell;
