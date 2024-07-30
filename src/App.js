// import { auth } from "./firebaseConfig";
// import SignIn from "./components/Auth/SignIn";
// import SignOut from "./components/Auth/SignOut";
import React, { useState } from "react";
import Game from "./components/Game/Game";
import Rules from "./components/Rules/Rules";

const App = () => {
  // Stan początkowy zasad gry
  const [rules, setRules] = useState({
    timeTick: 100,
    maxTimeTick: 1000,
    minTimeTick: 1,
    gridHeight: 50,
    gridWidth: 50,
    birthRule: [3],
    survivalRule: [2, 3],
    cellSize: 10,
    minCellSize: 2,
    maxCellSize: 25,
    colors: [
      { threshold: 0, color: "#000000" },
      { threshold: 100, color: "#ff0000" },
      { threshold: 200, color: "#00ff00" },
      { threshold: 300, color: "#0000ff" },
      { threshold: 400, color: "#00ffff" },
      { threshold: 500, color: "#ffff00" },
      { threshold: 600, color: "#000000" },
    ],
  });

  return (
    <div className="main">
      {/* Komponent zasad gry */}
      <Rules rules={rules} setRules={setRules} />
      {/* Komponent gry */}
      <Game rules={rules} />
    </div>
  );
};

export default App;
