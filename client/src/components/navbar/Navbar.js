import React from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  return (
    <div className="navbar p-5 pt-8 flex justify-between">
      <div className="left-container flex items-center w-2/3">
        <div className="logo w-full">
          <span className="text-2xl text-center p-1 rounded-md font-bold text-yahoo-purple bg-yahoo-white bg-opacity-75">
            yahoo<span className="text-yahoo-purple italic">!</span>
            <span className="text-yahoo-grey"> mail</span>
          </span>
        </div>
        {/* Add a search bar where you can search for emails with a button having a search icon */}
        <div className="search bg-white rounded-md flex items-center h-10 w-full">
          <input
            type="text"
            className="search__input m-1 ml-2 focus:outline-none w-full"
            placeholder="Search for emails"
          />
          <button className="search__button bg-yahoo-light-purple p-1 rounded-tr-md rounded-br-md h-full">
            <FaSearch fill="white" />
          </button>
        </div>
      </div>
      <div className="profile-icon w-1/3 flex justify-end mr-5">
        <CgProfile size={45} className="hover:cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
