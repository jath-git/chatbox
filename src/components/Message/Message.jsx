import React from "react";
import "./Message.scss";

export default function Message({ participants, collectionParticipants, message, user, collectionMessages, modify }) {
  const { text, email, photoURL, uid, uniqueId } = message;

  const deleteMessage = async () => {
    await collectionMessages.doc(uniqueId).delete();

    // TODO: currently O(n) efficiency but since participants are ordered by uid, change to O(log n)
    //   using midpoint, low, high reduction pattern
    let participantFound = -1;
    for (let i = 0; participantFound == -1 && i < participants.length; ++i) {
      if (participants[i].uid === uid) {
        participantFound = i;
      }
    }

    if (participants[participantFound].activeMessages === 1) {
      await collectionParticipants.doc(participants[participantFound].uniqueId).delete();
    } else {
      await collectionParticipants.doc(participants[participantFound].uniqueId).update({ activeMessages: participants[participantFound].activeMessages - 1 });
    }
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
