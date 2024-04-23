import React from "react";
import { googleLogout } from "@react-oauth/google";

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Signout = ({ onSuccessfulLogout }) => {
  const onSuccess = () => {
    console.log("Logout made successfully");
  };

  const handleLogout = () => {
    googleLogout();
    onSuccess();
    onSuccessfulLogout();
  };

  return (
    <div id="signOutButton" className="py-2 px-4 rounded-full mt-2">
      <button className="py-2 px-4 rounded-full mt-2" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default Signout;
