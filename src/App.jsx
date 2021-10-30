import { useState } from "react";
import "./global.scss";
import Chat from "./components/Chat/Chat.jsx";
import Join from "./components/Join/Join.jsx";
import Participants from "./components/Participants/Participants.jsx";
import Password from "./components/Password/Password.jsx";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

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
  const [room, setRoom] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bot, setBot] = useState(null);

  const showChatRoom = () => {
    return (
      <div>
        <Password firestore={firestore} room={room} showPassword={showPassword} room={room} firestore={firestore} />
        <Chat user={user ? auth : BotObj} firestore={firestore} room={room} setShowParticipants={setShowParticipants} showParticipants={showParticipants} setShowPassword={setShowPassword} showPassword={showPassword} />
        <Participants firestore={firestore} room={room} user={user ? auth : BotObj} showParticipants={showParticipants} />
      </div>
    );
  }

  const BotObj = {
    currentUser: {
      email: "[UNAVAILABLE]",
      photoURL: `../../assets/bot${Math.floor(Math.random() * 8)}.png`,
      uid: `${Date().valueOf()} ${Math.random()}`
    },
    signOut: function () {
      setBot(null);
    }
  }

  return (
    <div className="App">
      {user || bot ? showChatRoom() : <Join firestore={firestore} auth={auth} room={room} setRoom={setRoom} setBot={setBot} />}
    </div>
  );
}

export default App;
