import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import closeIcon from "../../assets/close-square-svgrepo-com.svg";
import editIcon from "../../assets/edit-svgrepo-com.svg";

const Profile = ({ userProfile, setShowProfileModal }) => {
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const inputRef = useRef(null);
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("expirationDate");
    Cookies.remove("jwt");
    Cookies.remove("user_id");
    Cookies.remove("username-localhost-8888");
    window.location = "#/";
  };

  const closeModal = (event) => {
    if (event.target.id === "profile-view") {
      event.preventDefault();
      setShowProfileModal(false);
    }
  };

  useEffect(() => {
    if (isEditingLanguage) {
      inputRef.current.focus();
    }
  }, [isEditingLanguage]);

  //   const handleUserLanguage = () => {};

  return (
    <div
      id="profile-view"
      className="profile-view z-50 bg-black bg-opacity-50 fixed top-0 left-0 w-full h-screen overflow-auto flex items-center justify-center transition-all duration-300 ease-in-out"
      onClick={closeModal}
    >
      <div
        id="profile-modal"
        className="profile-modal bg-yahoo-white rounded-2xl shadow-2xl p-5 w-1/2 h-1/2 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="modal-content w-full h-3/4">
            <div className="modal-header w-full flex justify-end">
              <img
                src={closeIcon}
                alt="close"
                className="w-8 h-8 cursor-pointer"
                onClick={() => setShowProfileModal(false)}
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
            <div className="user-details flex justify-evenly items-center mt-5 mb-8 h-full">
              <div className="user-details-names flex-col justify-self-start pointer-events-none">
                <p className="text-start">Email: </p>
                <p className="text-start mt-5">Language:</p>
              </div>
              <div className="user-details-values flex-col justify-between">
                <p className="text-start text-yahoo-grey pointer-events-none">
                  {userProfile?.email}
                </p>
                <div className="user-language-value flex items-center justify-between mt-5">
                  <input
                    ref={inputRef}
                    id="language-input"
                    className={`text-start focus:outline-none border-b-2 ${
                      isEditingLanguage
                        ? "text-black border-blue-500"
                        : "text-yahoo-grey pointer-events-none"
                    }`}
                    placeholder={`${userProfile?.preferred_language}`}
                  />
                  <button
                    id="edit-button"
                    className="text-start z-50"
                    onClick={() => setIsEditingLanguage(!isEditingLanguage)}
                  >
                    <img src={editIcon} alt="edit" className="w-10 h-10" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer flex items-center justify-center w-full">
          <button className="text-red-500" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
