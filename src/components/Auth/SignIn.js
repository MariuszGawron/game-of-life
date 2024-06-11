import React, { useState, useEffect } from "react";
import { auth, GoogleAuthProvider, signInWithPopup } from "../../firebaseConfig";
import SignOut from "./SignOut"; // Importuj komponent SignOut

const SignIn = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Sukces logowania
        console.log("Zalogowano jako:", result.user);
      })
      .catch((error) => {
        // Błąd logowania
        console.error("Błąd logowania:", error);
      });
  };

  return (
    <div>
      {user ? (
        <>
          <p>Witaj, {user.displayName}</p>
          <SignOut /> {/* Użyj komponentu SignOut */}
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default SignIn;
