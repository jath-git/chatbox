import React, { useState } from 'react';
import firebase from "firebase/compat/app";
import "./Join.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Join({ firestore, auth, room, setRoom, setBot, setClientMessage, setShowClientMessage }) {
  const [password, setPassword] = useState("");

  let tempRoom = room;
  if (tempRoom === "") {
    tempRoom = "global";
  }

  const collectionInformation = firestore.collection(`${tempRoom}-information`);
  const [information] = useCollectionData(collectionInformation, {
    idField: "uniqueId",
  });

  const validateUserRoom = (googleProvider) => {
    if (!information || !information.length || information[0].password === "" || password === information[0].password) {
      let hyphenFound = false;
      for (let i = 0; !hyphenFound && i < room.length; ++i) {
        if (room[i] === "-") {
          hyphenFound = true;
        }
      }

      if (!hyphenFound) {
        setShowClientMessage(false);
        if (googleProvider) {
          auth.signInWithPopup((new firebase.auth.GoogleAuthProvider()));
        } else {
          const BotObj = {
            currentUser: {
              email: "[NO EMAIL FOR BOT]",
              photoURL: `../../assets/bot${Math.floor(Math.random() * 8)}.png`,
              uid: `${Date().valueOf()} ${Math.random()}`
            },
            signOut: function () {
              setBot(null);
            }
          }
          setBot(BotObj);
        }
      } else {
        setShowClientMessage(true);
        setClientMessage("CHAT ROOM MUST NOT INCLUDE ANY HYPHENS ( - )");
      }
    } else {
      setShowClientMessage(true);
      if (password === "") {
        setClientMessage("CHAT ROOM IS SECURED AND REQUIRES A PASSWORD");
      } else {
        setClientMessage("ENTERED PASSWORD IS INCORRECT");
      }
    }
  }

  return (
    <div className="join">
      <div className="text">Join Room</div>
      <div className="logos">
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value.toLowerCase())}
          placeholder="Enter Chat Room"
          onKeyDown={e => {
            const enterKey = 13;
            if (e.keyCode === enterKey)
              validateUserRoom(false);
          }}
        />
        <input placeholder="Enter Password [For Secured Rooms Only]" value={password} type="password"
          onChange={(e) => setPassword(e.target.value)} onKeyDown={e => {
            const enterKey = 13;
            if (e.keyCode === enterKey)
              validateUserRoom(false);
          }} />
        <div className="img-container">
          <img
            src="../assets/google.png"
            onClick={() => {
              validateUserRoom(true);
            }}
          />
          <img
            src="../../assets/bot1.png"
            onClick={() => {
              validateUserRoom(false);
            }}
          />
          <img
            src="../../assets/question.png"
            onClick={() => {
              setShowClientMessage(true);
              setClientMessage("CLICK ICONS TO SIGN IN BY GOOGLE VERIFICATION OR AS AN ANONYMOUS BOT");
            }}
          />
        </div>
      </div>
    </div>
  );
}
