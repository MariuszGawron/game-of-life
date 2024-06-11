import React from "react";
import { auth } from "../../firebaseConfig";

const SignOut = () => {
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Wylogowano pomyślnie");
      })
      .catch((error) => {
        console.error("Błąd podczas wylogowywania:", error);
      });
  };

  return <button onClick={signOut}>Sign out</button>;
};

export default SignOut;
