import React from "react";
import "./Message.scss";

export default function Message(props) {
  const { text, uid, photoURL } = props.message;
  const auth = props.auth;

  return (
    <>
      <div className={uid === auth.currentUser.uid ? "outgoing" : "incoming"}>
        <img src={photoURL} />
        <div>{text}</div>
      </div>
    </>
  );
}
