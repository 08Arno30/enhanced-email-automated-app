import React from "react";
import Cookies from "js-cookie";
import closeIcon from "../../assets/close-square-svgrepo-com.svg";

const Profile = ({ userProfile, closeProfileModal }) => {
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("expirationDate");
      Cookies.remove("jwt");
      Cookies.remove("user_id");
      Cookies.remove("username-localhost-8888");
    window.location = "#/";
  };

  const handleUserLanguage = () => {};

  return (
    <div
      className="profile-view z-50 bg-black bg-opacity-50 fixed top-0 left-0 w-full h-screen overflow-auto flex items-center justify-center transition-all duration-300 ease-in-out"
      onClick={closeProfileModal}
    >
      <div className="profile-modal bg-white rounded-2xl shadow-2xl p-5 w-1/2 h-1/2 flex-col justify-between">
        <div className="modal-content w-full">
          <div className="modal-header w-full flex justify-end">
            <img
              src={closeIcon}
              alt="close"
              className="w-8 h-8 cursor-pointer"
              onClick={closeProfileModal}
            />
          </div>
          <div className="profile-icon w-full flex items-center justify-center">
            <img
              src={userProfile?.user_picture}
              className="rounded-full cursor-default w-14 md:w-20 lg:w-24 "
              alt="profile"
              title="Profile"
            />
          </div>
          <h3 className="text-lg  md:text-2xl font-bold mt-2 text-center">
            {userProfile?.user_firstname} {userProfile?.user_lastname}
          </h3>
          <div className="user-details flex justify-evenly items-center mt-5 mb-8">
            <div className="user-email flex-col justify-self-start">
              <p className="text-start">Email: </p>
              <p className="text-start">Language:</p>
            </div>
            <div className="user-language flex-col">
              <p className="text-start">{userProfile?.email}</p>
              <p className="text-start">{userProfile?.preferred_language}</p>
            </div>
          </div>
        </div>
        <div className="modal-footer flex items-center justify-center w-full">
          <button className="text-red-500" onClick={logout}>Log out</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
