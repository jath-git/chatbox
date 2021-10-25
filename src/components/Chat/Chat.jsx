import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "../Message/Message.jsx";
import React, { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "./Chat.scss";

export default function Chat({ auth, firestore }) {
  const last = useRef();
  const [formValue, setFormValue] = useState("");

  const collection = firestore.collection("messages");
  const [messages] = useCollectionData(collection.orderBy("createdAt"), {
    idField: "id",
  });

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await collection.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    last.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="text">
        Global Chat Room
        <img
          src="../assets/close.png"
          onClick={() => {
            auth.signOut();
          }}
        />
      </div>
      <div className="message-list">
        {messages &&
          messages.map((msg) => <Message message={msg} auth={auth} />)}

        <span ref={last}></span>
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Enter message here"
        />

        <button type="submit" disabled={!formValue}>
          Send
        </button>
      </form>
    </div>
  );
}
