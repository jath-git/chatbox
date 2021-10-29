import React from "react";
import "./Participants.scss"; import { useCollectionData } from "react-firebase-hooks/firestore";
import Participant from "../Participant/Participant.jsx";

export default function Participants({ firestore, room, auth }) {
    if (room === "") {
        room = "global";
    }
    const currentUser = auth.currentUser;
    const userCollectionName = `${room}-participantss`;
    const collectionParticipants = firestore.collection(userCollectionName);
    const [participants] = useCollectionData(collectionParticipants.orderBy("email"), {
        idField: "uniqueId",
    });

    return (
        <div className="participants">
            <div className="participants-list">
                <Participant participant={{ email: currentUser.email, photoURL: currentUser.photoURL }} currentEmail={currentUser.email} special={true}/>
                {participants &&
                    participants.map((participant) => <Participant participant={participant} currentEmail={currentUser.email} special={false}/>)}
            </div>
        </div>
    );
}
