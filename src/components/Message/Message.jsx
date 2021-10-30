import React from "react";
import "./Message.scss";

export default function Message({ message, user, collectionMessages, modify }) {
  const { text, email, photoURL, uid, uniqueId } = message;

  const deleteMessage = async () => {
    await collectionMessages.doc(uniqueId).delete();
  }

  return (
    <div className="message">
      <div className={uid === user.currentUser.uid ? "outgoing" : "incoming"}>
        <img className="photo" src={photoURL} />
        <div>{text}</div>
        <div className={modify ? "modify-container" : "none"}>
          <img className="delete" src="../../assets/delete.png" onClick={deleteMessage} />
        </div>
      </div>
    </div>
  );
}
