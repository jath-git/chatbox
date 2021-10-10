import React, { useRef, useState } from "react";
import "./global.scss";
import Chat from "./components/Chat/Chat.jsx";
import Join from "./components/Join/Join.jsx";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";

firebase.initializeApp({
  apiKey: "AIzaSyBRsY3uU6Sxr-tZYXgwDGn-lN4yM58nwU0",
  authDomain: "chatbox-authentication.firebaseapp.com",
  projectId: "chatbox-authentication",
  storageBucket: "chatbox-authentication.appspot.com",
  messagingSenderId: "408104309600",
  appId: "1:408104309600:web:3d7a0fc25d88b71d698405",
  measurementId: "G-Q5FPW0B4MZ",
});
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {user ? <Chat auth={auth} firestore={firestore} /> : <Join auth={auth} />}
    </div>
  );
}

export default App;
