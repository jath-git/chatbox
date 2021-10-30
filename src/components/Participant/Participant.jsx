import React from "react";
import "./Participant.scss";

export default function Participant(props) {
  const { email, photoURL, uid } = props.participant;

  if (props.special) {
    return (
      <div className="special participant" >
        <img src={photoURL} />
        <div>{email}</div>
      </div>
    )
  }

  return (
    <div className={uid === props.currentUid ? "none" : "participant"} >
      <img src={photoURL} />
      <div>{email}</div>
    </div>
  );
}