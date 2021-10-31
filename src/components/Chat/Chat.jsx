import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "../Message/Message.jsx";
import React, { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "./Chat.scss";

export default function Chat({ user, firestore, room, setShowParticipants, showParticipants, setShowPassword, showPassword, setClientMessage, setShowClientMessage }) {
  if (room === "") {
    room = "global";
  }

  window.onbeforeunload = () => {
    return setShowClientMessage(true);
  }

  const last = useRef();
  const [messageValue, setMessageValue] = useState("");
  const [modify, setModify] = useState(false);
  const { photoURL, email, uid } = user.currentUser;

  const collectionMessages = firestore.collection(room);
  const [messages] = useCollectionData(collectionMessages.orderBy("timeStamp"), {
    idField: "uniqueId",
  });
  const collectionParticipants = firestore.collection(`${room}-participants`);
  const [participants] = useCollectionData(collectionParticipants.orderBy("uid"), {
    idField: "uniqueId",
  });

  const findParticipant = () => {
    // TODO: currently O(n) efficiency but since participants are ordered by uid, change to O(log n)
    //   using midpoint, low, high reduction pattern
    for (let i = 0; i < participants.length; ++i) {
      if (participants[i].uid === uid) {
        return i;
      }
    }
    return -1;
  }

  const sendMessage = async (e) => {
    setModify(false);

    e.preventDefault();
    if (messageValue == "") {
      return;
    }

    const participantFound = findParticipant();

    if (participantFound == -1) {
      await collectionParticipants.add({
        photoURL,
        email,
        uid,
        activeMessages: 1
      });
    } else {
      await collectionParticipants.doc(participants[participantFound].uniqueId).update({ activeMessages: participants[participantFound].activeMessages + 1 });
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
            setClientMessage("UNABLE TO SET PASSWORD FOR GLOBAL CHAT ROOM. TRY ANOTHER ROOM");
          } else {
            setShowPassword(!showPassword)
          }
        }} />
        {room} chat room
        <img
          src="../assets/close.png"
          onClick={() => {
            setShowClientMessage(false);
            user.signOut();
          }}
        />
        <img className="modify" src="../../assets/settings.png" onClick={() => {
          const participantFound = findParticipant();

          if (participantFound == -1) {
            setShowClientMessage(true);
            setClientMessage("MUST HAVE ACTIVE MESSAGE TO DELETE")
          } else {
            setModify(!modify);
          }
        }} />
        <img src="../../assets/arrow.png" onClick={() => setShowParticipants(!showParticipants)} />
      </div>
      <div className="message-list">
        {messages &&
          messages.map((msg) => <Message participants={participants} collectionParticipants={collectionParticipants} message={msg} user={user} modify={modify} collectionMessages={collectionMessages} />)}

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
