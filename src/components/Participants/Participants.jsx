import React from "react";
import "./Participants.scss"; import { useCollectionData } from "react-firebase-hooks/firestore";
import Participant from "../Participant/Participant.jsx";

export default function Participants({ firestore, room, auth }) {
    if (room === "") {
        room = "global";
    }
    const userCollectionName = `${room}-participantss`;
    const collectionParticipants = firestore.collection(userCollectionName);
    const [participants] = useCollectionData(collectionParticipants, {
        idField: "uniqueId",
    });
    
    return (
        <div className="participants">
            <div className="participants-list">
                {participants &&
                    participants.map((participant) => <Participant participant={participant} auth={auth} />)}
            </div>
        </div>
    );
}
