import React from "react";
import "./Message.scss";
import { doc, deleteDoc } from "firebase/firestore";


export default function Message({ message, auth, collectionMessages, modify }) {
  const { text, email, photoURL, uniqueId } = message;

  const deleteMessage = async () => {
    await collectionMessages.doc(uniqueId).delete();
  }

  return (
    <div className="message">
      <div className={email === auth.currentUser.email ? "outgoing" : "incoming"}>
        <img className="photo" src={photoURL} />
        <div>{text}</div>
        <div className={modify ? "modify-container" : "none"}>
          <img className="delete" src="../../assets/delete.png" onClick={deleteMessage} />
        </div>
      </div>
    </div>
  );
}
