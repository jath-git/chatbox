import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "../Message/Message.jsx";
import React, { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "./Chat.scss";

export default function Chat({ user, firestore, room, setShowParticipants, showParticipants, setShowPassword, showPassword, setClientMessage, setShowClientMessage }) {
  if (room === "") {
    room = "global";
  }

  const last = useRef();
  const [messageValue, setMessageValue] = useState("");
  const [modify, setModify] = useState(false);

  const collectionMessages = firestore.collection(room);
  const [messages] = useCollectionData(collectionMessages.orderBy("timeStamp"), {
    idField: "uniqueId",
  });
  const collectionParticipants = firestore.collection(`${room}-participants`);
  const [participants] = useCollectionData(collectionParticipants.orderBy("uid"), {
    idField: "uniqueId",
  });

  const sendMessage = async (e) => {
    setModify(false);

    e.preventDefault();
    if (messageValue == "") {
      return;
    }

    const { photoURL, email, uid } = user.currentUser;

    let participantFound = false;
    for (let i = 0; !participantFound && i < participants.length; ++i) {
      if (participants[i].email === email) {
        participantFound = true;
      }
    }

    if (!participantFound) {
      await collectionParticipants.add({
        photoURL,
        email,
        uid
      });
    }

    await collectionMessages.add({
      text: messageValue,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      email,
      uid
    });

    setMessageValue("");
    last.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat">
      <div className="text">
        <img className="setup" src="../../assets/arrow.png" onClick={() => {
          if (room === "global") {
            setShowClientMessage(true);
            setClientMessage("UNABLE TO SET PASSWORD FOR GLOBAL CHAT ROOM");
          } else {
            setShowPassword(!showPassword)
          }
        }} />
        {room} chat room
        <img
          src="../assets/close.png"
          onClick={() => {
            user.signOut();
          }}
        />
        <img className="modify" src="../../assets/settings.png" onClick={() => setModify(!modify)} />
        <img src="../../assets/arrow.png" onClick={() => setShowParticipants(!showParticipants)} />
      </div>
      <div className="message-list">
        {messages &&
          messages.map((msg) => <Message message={msg} user={user} modify={modify} collectionMessages={collectionMessages} />)}

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
