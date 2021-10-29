import React from "react";
import "./Password.scss";

export default function Password({ showPassword }) {
    return (
        <div className={showPassword ? "password" : "none"}>
            <div className="heading">Password</div>
        </div>
    );
}
