import { auth } from "./firebaseConfig";
import SignIn from "./components/Auth/SignIn";
import SignOut from "./components/Auth/SignOut";
import React, { useState } from "react";
import Game from "./components/Game/Game";
import Rules from "./components/Rules/Rules";

const App = () => {
  // Stan początkowy zasad gry
  const [rules, setRules] = useState({
    timeTick: 500,
    gridSize: 50,
    birthRule: [3],
    survivalRule: [2, 3],
    cellSize: 10,
    colors: [
      { threshold: 0, color: "#000000" },
      { threshold: 100, color: "#ff0000" },
      { threshold: 200, color: "#00ff00" },
      { threshold: 300, color: "#0000ff" },
    ],
  });

  return (
    <div className="main">
      {/* Komponent zasad gry */}
      <Rules rules={rules} setRules={setRules} gridSize={rules.gridSize} />
      {/* Komponent gry */}
      <Game rules={rules} />
    </div>
  );
};

export default App;
