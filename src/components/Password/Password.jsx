import React from "react";
import "./Password.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Password({ firestore, showPassword, setShowPassword, room }) {
    if (room === "" || room === "global") {
        room = "global";
        // setShowPassword(false);
    }

    const collectionInformation = firestore.collection(`${room}-information`);
    const [information] = useCollectionData(collectionInformation, {
        idField: "uniqueId",
    });

    const makeFirstPassword = async () => {
        if (information !== undefined && information.length === 0) {
            await collectionInformation.add({
                password: ""
            });
        }
    }

    const updatePassword = async e => {
        await collectionInformation.doc(information[0].uniqueId).update({ password: e.target.value });
    }

    const informationNew = !information || !information.length;

    return (
        <div className={showPassword ? "password" : "none"}>
            <div className="heading">Security</div>
            <div className="v-center">
                <div className="show">{informationNew || information[0].password === "" ? "NO PASSWORD SET UP" : `CURRENT PASSWORD: ${information[0].password}`}</div>
                <input
                    className={informationNew ? "none" : "password-input"}
                    type="password"
                    placeholder="Enter New Password For Room"
                    value={informationNew || information[0].password === "" || !information[0].password ? "" : information[0].password}
                    onChange={e => updatePassword(e)}
                />
                <div className={informationNew ? "button" : "none"} onClick={
                    makeFirstPassword
                }>Initialize Password</div>
            </div>
        </div>
    );
}
