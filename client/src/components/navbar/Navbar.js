import React from "react";
import { FaSearch } from "react-icons/fa";
const Navbar = ({ showProfileModal, userProfile }) => {
  return (
    <div className="navbar pl-5 pt-3 pb-3 flex justify-between">
      <div className="left-container flex items-center w-2/3">
        <div className="logo w-full flex justify-start">
          <span className="text-lg md:text-xl lg:text-2xl text-center p-2 rounded-md font-bold text-yahoo-purple bg-yahoo-white bg-opacity-75">
            yahoo<span className="text-yahoo-purple italic">!</span>
            <span className="text-yahoo-grey"> mail</span>
          </span>
        </div>
        {/* Add a search bar where you can search for emails with a button having a search icon */}
        <div className="search bg-yahoo-white rounded-md flex items-center h-10 w-full">
          <input
            type="text"
            className="search__input bg-yahoo-white m-1 ml-2 focus:outline-none w-full"
            placeholder="Search for emails"
          />
          <button className="search__button bg-yahoo-light-purple p-1 rounded-tr-md rounded-br-md h-full">
            <FaSearch fill="white" />
          </button>
        </div>
      </div>
      <div className="profile-icon w-1/3 flex justify-end mr-5">
        <img
          src={userProfile?.user_picture}
          className="rounded-full w-14 cursor-pointer"
          alt="profile"
          onClick={showProfileModal}
          title="Profile"
        />
      </div>
    </div>
  );
};

export default Navbar;
