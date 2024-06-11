import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import SignIn from "./components/Auth/SignIn";
import SignOut from "./components/Auth/SignOut";
import Game from "./components/Game/Game";
import Rules from "./components/Rules/Rules";

const App = () => {
  const [rules, setRules] = useState({
    minNeighbors: 2,
    maxNeighbors: 3,
    birthNeighbors: 3,
  });

  return (
    <div>
      <SignOut />
      <SignIn />
      {auth.currentUser && (
        <div>
          <Rules rules={rules} setRules={setRules} />
          <Game rules={rules} />
        </div>
      )}
    </div>
  );
};

export default App;
