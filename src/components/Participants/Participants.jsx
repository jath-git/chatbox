import React from "react";
import "./Participants.scss"; import { useCollectionData } from "react-firebase-hooks/firestore";
import Participant from "../Participant/Participant.jsx";

export default function Participants({ firestore, room, user, showParticipants }) {
    if (room === "") {
        room = "global";
    }

    const currentUser = user.currentUser;
    const userCollectionName = `${room}-participants`;
    const collectionParticipants = firestore.collection(userCollectionName);
    const [participants] = useCollectionData(collectionParticipants.orderBy("uid"), {
        idField: "uniqueId",
    });

    return (
        <div className={showParticipants ? "participants" : "none"}>
            <div className="heading">Participants</div>
            <div className="participants-list">
                <Participant participant={{ email: currentUser.email, photoURL: currentUser.photoURL, uid: currentUser.uid }} currentUid={currentUser.uid} special={true}/>
                {participants &&
                    participants.map((participant) => <Participant participant={participant} currentUid={currentUser.uid} special={false} />)}
            </div>
        </div >
    );
}
