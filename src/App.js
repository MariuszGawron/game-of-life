import React, { useState } from "react";
// import { auth } from "./firebaseConfig";
// import SignIn from "./components/Auth/SignIn";
// import SignOut from "./components/Auth/SignOut";
import Game from "./components/Game/Game";
import Rules from "./components/Rules/Rules";

const App = () => {
  const [rules, setRules] = useState({
    timeTick: 500,
    gridSize: 50,
    birthRule: [3],
    survivalRule: [2, 3],
    cellSize: 10,
  });

  return (
    // <div>
    //   <SignIn />
    //   {auth.currentUser && (
    <div className="main">
      <Rules rules={rules} setRules={setRules} />
      <Game rules={rules} />
    </div>
    //     )}
    //   </div>
  );
};

export default App;
