import React from "react";
import "./Inbox.css";

//components
import Navbar from "../navbar/Navbar";

const Inbox = ({ onSuccessfulLogout }) => {
  return (
    <div className="inbox-view h-screen w-full">
      <Navbar onSuccessfulLogout={onSuccessfulLogout} />
    </div>
  );
};

export default Inbox;
