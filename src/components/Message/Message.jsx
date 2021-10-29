import React from "react";
import "./Message.scss";

export default function Message(props) {
  const { text, email, photoURL } = props.message;
  const auth = props.auth;
  
  return (
    <div className="message">
      <div className={email === auth.currentUser.email ? "outgoing" : "incoming"}>
        <img src={photoURL} />
        <div>{text}</div>
      </div>
    </div>
  );
}
