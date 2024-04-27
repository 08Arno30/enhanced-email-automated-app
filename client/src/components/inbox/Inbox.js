import React, { useState } from "react";
import "./Inbox.css";
import Fade from "react-reveal/Fade";

//components
import Navbar from "../navbar/Navbar";

const Inbox = ({ onSuccessfulLogout }) => {
  return (
    <Fade>
    <div className="inbox-view h-screen w-full">
      <Navbar onSuccessfulLogout={onSuccessfulLogout} />
    </div>
    </Fade>
  );
};

export default Inbox;
