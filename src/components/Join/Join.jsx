import React from "react";
import firebase from "firebase/app";
import "./Join.scss";

export default function Join({ auth }) {
  return (
    <div>
      <div className="text">Join Room</div>
      <div className="logos">
        <img
          src="../assets/google.png"
          onClick={() => {
            auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
          }}
        />
      </div>
    </div>
  );
}
