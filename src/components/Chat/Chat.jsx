import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "../Message/Message.jsx";
import React, { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "./Chat.scss";

export default function Chat({ auth, firestore, room, setShowParticipants, showParticipants, setShowPassword, showPassword }) {
  if (room === "") {
    room = "global";
  }

  const userCollectionName = `${room}-participants`;

  const last = useRef();
  const [messageValue, setMessageValue] = useState("");
  const [modify, setModify] = useState(false);
  const collectionMessages = firestore.collection(room);
  const collectionParticipants = firestore.collection(userCollectionName);
  const [messages] = useCollectionData(collectionMessages.orderBy("timeStamp"), {
    idField: "uniqueId",
  });
  const [participants] = useCollectionData(collectionParticipants.orderBy("email"), {
    idField: "uniqueId",
  });

  const sendMessage = async (e) => {
    setModify(false);

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
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      email
    });

    setMessageValue("");
    last.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat">
      <div className="text">
        {/* <img className="setup" src="../../assets/arrow.png" onClick={() => setShowPassword(!showPassword)} /> */}
        {room} chat room
        <img
          src="../assets/close.png"
          onClick={() => {
            auth.signOut();
          }}
        />
        <img className="modify" src="../../assets/settings.png" onClick={() => setModify(!modify)} />
        <img className="modify" src="../../assets/arrow.png" onClick={() => setShowParticipants(!showParticipants)} />
      </div>
      <div className="message-list">
        {messages &&
          messages.map((msg) => <Message message={msg} auth={auth} modify={modify} collectionMessages={collectionMessages} />)}

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
