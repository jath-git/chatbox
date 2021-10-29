import React from 'react';
import firebase from "firebase/compat/app";
import "./Join.scss";

export default function Join({ auth, room, setRoom }) {
  const validateUserRoom = () => {
    setRoom(room.toLowerCase());
    let hyphenFound = false;
    for (let i = 0; !hyphenFound && i < room.length; ++i) {
      if (room[i] === "_" || room[i] === "-") {
        hyphenFound = true;
      }
    }

    if (!hyphenFound) {
      auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
  }

  return (
    <div>
      <div className="text">Join Room</div>
      <div className="logos">
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter Chat Room"
          onKeyDown={e => {
            const enterKey = 13;
            if (e.keyCode === enterKey)
              validateUserRoom();
          }}
        />
          <img
            src="../assets/google.png"
            onClick={() => {
              validateUserRoom();
            }}
          />
        </div>
    </div>
  );
}
