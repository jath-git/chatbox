import React from "react";
import firebase from "firebase/compat/app";
import "./Join.scss";

export default function Join({ auth }) {
  return (
    <div>
      <div className="text">Join Room</div>
      <div className="logos">
        {/* <form className="send">
          <input
            type="text"
            placeholder="Enter User Name"
          />
          <input
            type="text"
            placeholder="Enter Chat Room"
          />

          <button>
            Join
          </button>
        </form> */}
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
