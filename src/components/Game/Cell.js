import React from "react";

const Cell = ({ isAlive, toggleCell }) => {
  return <div className={`cell ${isAlive ? "alive" : ""}`} onClick={toggleCell} />;
};

export default Cell;
