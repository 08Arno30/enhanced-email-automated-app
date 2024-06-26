import React, { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import * as API from "../../api/index";
import toast, { Toaster } from "react-hot-toast";
import closeIcon from "../../assets/close-square-svgrepo-com.svg";
import langs from "../../utils/languages";

const languages = Object.entries(langs).map(([value, label]) => ({
  value,
  label,
}));

const Profile = ({
  userProfile,
  setShowProfileModal,
  userId,
  userLanguage,
  setUserLanguage,
  setUserPreviousLanguage,
}) => {
  const selectRef = useRef(null);
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

  useEffect(() => {}, []);

  const handleUserLanguage = async (event) => {
    const selectedLanguageCode = event.target.value;
    const selectedLanguage = languages.find(
      (language) => language.value === selectedLanguageCode
    ).label;

    toast("Updating language...", {
      duration: 1400,
      icon: "⏳",
    });

    const response = await API.updateLanguage(userId, selectedLanguage);

    if (response) {
      setUserPreviousLanguage(userLanguage);
      setUserLanguage(selectedLanguage);
      setTimeout(() => {
        toast.success("Language updated successfully!");
      }, 1500);
    } else {
      toast.error("Could not update language!");
    }
  };

  return (
    <div
      id="profile-view"
      className="profile-view z-50 bg-black bg-opacity-50 fixed top-0 left-0 w-full h-screen overflow-auto flex items-center justify-center transition-all duration-300 ease-in-out"
      onClick={closeModal}
    >
      <div>
        <Toaster />
      </div>
      <div
        id="profile-modal"
        className="profile-modal bg-yahoo-white rounded-2xl shadow-2xl p-5 w-1/2 h-1/2 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="modal-content w-full h-1/3">
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
                  <select
                    ref={selectRef} // Assign ref to the dropdown
                    id="language-select"
                    className="text-start focus:outline-none border border-gray-300 rounded px-2 py-1 cursor-pointer"
                    value={
                      userProfile?.preferred_language || languages[0].value
                    } // Set initial value
                    onChange={handleUserLanguage}
                  >
                    {languages.map((language) => (
                      <option key={language.value} value={language.value}>
                        {language.label}
                      </option>
                    ))}
                  </select>
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
