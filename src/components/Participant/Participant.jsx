import React from "react";
import "./Participant.scss";

export default function Participant(props) {
  const { email, photoURL } = props.participant;
  const auth = props.auth;

  return (
    <div className="participant">
      <img src={photoURL} />
      <div>{email}</div>
    </div>
  );
}