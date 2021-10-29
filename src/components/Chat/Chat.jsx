import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "../Message/Message.jsx";
import React, { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "./Chat.scss";

export default function Chat({ auth, firestore, room }) {
  if (room === "") {
    room = "global";
  }

  const userCollectionName = `${room}-participants`;

  const last = useRef();
  const [messageValue, setMessageValue] = useState("");
  const collectionMessages = firestore.collection(room);
  const collectionParticipants = firestore.collection(userCollectionName);
  const [messages] = useCollectionData(collectionMessages.orderBy("createdAt"), {
    idField: "uniqueId",
  });
  const [participants] = useCollectionData(collectionParticipants.orderBy("email"), {
    idField: "uniqueId",
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageValue == "") {
      return;
    }

    const { photoURL, email } = auth.currentUser;

    let participantFound = false;
    for (let i = 0; !participantFound && i < participants.length; ++i) {
      if (participants[i].email === email) {
        participantFound = true;
      }
    }

    if (!participantFound) {
      await collectionParticipants.add({
        photoURL,
        email
      });
    }

    await collectionMessages.add({
      text: messageValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      email
    });

    setMessageValue("");
    last.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat">
      <div className="text">
        {room} chat room
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

      <form className="submit" onSubmit={sendMessage}>
        <input
          type="text"
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          placeholder="Enter message here"
        />

        <button type="submit" disabled={!messageValue}>
          Send
        </button>
      </form>
    </div>
  );
}
