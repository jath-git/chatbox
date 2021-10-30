import React, { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import "./Join.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Join({ firestore, auth, room, setRoom, setBot }) {
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
        if (room[i] === "_" || room[i] === "-") {
          hyphenFound = true;
        }
      }

      if (!hyphenFound) {
        if (googleProvider) {
          auth.signInWithPopup((new firebase.auth.GoogleAuthProvider()));
        } else {
          setBot({});
        }
      }
    }
  }

  return (
    <div>
      <div className="text">Join Room</div>
      <div className="logos">
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value.toLowerCase())}
          placeholder="Enter Chat Room (e.g. global)"
          onKeyDown={e => {
            const enterKey = 13;
            if (e.keyCode === enterKey)
              validateUserRoom(false);
          }}
        />
        <input placeholder="Enter Password For Secured Room Only" value={password} type="password"
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
        </div>
      </div>
    </div>
  );
}
