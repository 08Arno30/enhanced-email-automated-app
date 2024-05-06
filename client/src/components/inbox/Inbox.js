import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as API from "../../api/index";
import "./Inbox.css";

//components
import Navbar from "../navbar/Navbar";
import Profile from "../profile/Profile";

const Inbox = () => {
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleOpenModal = () => {
    setShowProfileModal(!showProfileModal);
  }

  useEffect(() => {
    if (Cookies.get("jwt")) {
      const getUser = async () => {
        const response = await API.getUser(Cookies.get("jwt"));

        if (response && response.user) {
          setUserProfile(response.user);
        }
      };

      getUser();
    }
  }, []);

  return (
    <div className="inbox-view h-screen w-full">
      <Navbar showProfileModal={handleOpenModal} userProfile={userProfile} />
      {showProfileModal && (
        <div className="profile-modal-overlay">
          <Profile userProfile={userProfile} closeProfileModal={handleOpenModal}/>
        </div>
      )}
    </div>
  );
};

export default Inbox;
