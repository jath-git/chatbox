import React from "react";
import "./Participant.scss";

export default function Participant(props) {
  const { email, photoURL } = props.participant;

  if (props.special) {
    return (
      <div className="special participant" >
        <img src={photoURL} />
        <div>{email}</div>
      </div>
    )
  }

  return (
    <div className={email === props.currentEmail ? "none" : "participant"} >
      <img src={photoURL} />
      <div>{email}</div>
    </div>
  );
}