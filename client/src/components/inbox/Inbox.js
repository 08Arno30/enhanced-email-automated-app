import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as API from "../../api/index";
import "./Inbox.css";
import folderClose from "../../assets/folder-close-svgrepo-com.svg";
import folderOpen from "../../assets/folder-open-svgrepo-com.svg";
import folderPlus from "../../assets/folder-plus-svgrepo-com.svg";
import folderOptions from "../../assets/options-svgrepo-com.svg";
import folderMove from "../../assets/upload-folder-svgrepo-com.svg";
import folderTrash from "../../assets/trash-svgrepo-com.svg";
import checkboxUnchecked from "../../assets/checkbox-unchecked-svgrepo-com.svg";
import checkboxChecked from "../../assets/checkbox-checked-svgrepo-com.svg";

//components
import Navbar from "../navbar/Navbar";
import Profile from "../profile/Profile";

const Inbox = () => {
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeView, setActiveView] = useState("inbox");
  const [folderList, setFolderList] = useState([]);
  const [activeFolder, setActiveFolder] = useState("");
  const [showOptions, setShowOptions] = useState(
    Array(folderList.length).fill(false) // Initial state array for all folders' options
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectAllEmailsOnPage, setSelectAllEmailsOnPage] = useState(false);
  const [listOfEmails, setListOfEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleToggleFolderOptions = (folderIndex) => {
    setShowOptions((prevOptions) => {
      // Create a new array filled with false (hidden options)
      const updatedOptions = prevOptions.map(() => false);
      // Set the clicked folder's option to true (shown)
      updatedOptions[folderIndex] = !prevOptions[folderIndex];
      return updatedOptions;
    });
    // Update activeFolder if necessary (optional)
    // if (folderList[folderIndex] === activeFolder) {
    //   setActiveFolder("");
    // } else {
    //   setActiveFolder(folderList[folderIndex]);
    // }
  };

  var listFolders = folderList.map((folder, index) => {
    return (
      <div
        key={folder}
        className="folder-button flex flex-col items-center text-yahoo-white md:text-md lg:text-lg mt-2"
      >
        <div className="main-container flex items-center justify-between w-full">
          <div
            className="folder-main-container flex items-center justify-between w-full cursor-pointer"
            onClick={() =>
              setActiveFolder(folder === activeFolder ? "" : folder)
            }
          >
            <img
              src={
                folder === activeFolder && !isDeleteModalOpen
                  ? folderOpen
                  : folderClose
              }
              className="folder-icon w-5 h-5"
              alt="folder"
            />
            <div className="folder-name-container flex items-center justify-between w-full">
              <p className="folder-name pl-2 pt-1">{folder}</p>
            </div>
          </div>
          <img
            src={folderOptions}
            className="folder-options w-4 h-5 mr-3 lg:mr-4 cursor-pointer"
            alt="options"
            onClick={() => handleToggleFolderOptions(index)}
          />
        </div>
        {showOptions[index] && expandFolderOptions(folder)}
      </div>
    );
  });

  const deleteFolder = (folder) => {
    // remove the folder from folderList and remove the corresponding option
    setFolderList((prevList) => prevList.filter((f) => f !== folder));
    setShowOptions((prevOptions) =>
      prevOptions.filter((_, index) => index !== folderList.indexOf(folder))
    );
    // set all options false
    setShowOptions(Array(folderList.length).fill(false));
    setIsDeleteModalOpen(false);
  };

  const ConfirmDeleteModal = React.memo(({ folder }) => {
    // create modal confirm if user want to delete
    return (
      <div className="confirm-modal w-full h-screen fixed top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="confirm-container bg-yahoo-white rounded-3xl shadow-2xl p-5 w-1/3">
          <div className="flex flex-col items-center">
            <p className="text-xl text-yahoo-purple font-bold">Are you sure?</p>
            <p className="text-sm text-yahoo-grey">
              This action cannot be undone.
            </p>
          </div>
          <div className="buttons-container flex items-center justify-evenly w-full mt-5">
            <button
              className="delete-button bg-red-500 bg-opacity-50 text-sm lg:text-base cursor-pointer p-2 rounded-md"
              onClick={() => deleteFolder(folder)}
            >
              Delete
            </button>
            <button
              className="cancel-button bg-yahoo-light-purple bg-opacity-50 text-sm lg:text-base cursor-pointer p-2 rounded-md"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  });

  const confirmDelete = (folder) => {
    setActiveFolder(folder);
    setIsDeleteModalOpen(true);
  };

  const handleRenameClick = (activeFolder) => {
    setActiveFolder(activeFolder);
    setIsRenameModalOpen(true);
  };

  const renameFolder = (newFolderName) => {
    setFolderList((prevList) =>
      prevList.map((folder) =>
        folder === activeFolder ? newFolderName : folder
      )
    );
    setIsRenameModalOpen(false);
    setActiveFolder("");
    setShowOptions(Array(folderList.length).fill(false));
    setNewName("");
  };

  const handleRenameKeyDown = (e) => {
    if (e.code === "Enter") {
      renameFolder(newName); // Trigger renaming on Enter
      e.preventDefault();
    }
  };

  const RenameModal = React.memo(({ folder }) => {
    return (
      <div
        key={folder}
        className="rename-modal w-full h-screen fixed top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="rename-container bg-yahoo-white rounded-3xl shadow-2xl p-5 w-1/3">
          <div className="flex flex-col items-center">
            <p className="text-xl text-yahoo-purple font-bold">Rename folder</p>
            <p className="text-sm text-yahoo-grey">
              Please enter a new name for the folder.
            </p>
          </div>
          <div className="rename-input-container w-full mt-5">
            <input
              key={folder}
              autoFocus={true}
              className="rename-input w-full p-2 rounded-lg"
              type="text"
              placeholder={folder}
              value={newName}
              onKeyDown={(e) => handleRenameKeyDown(e)}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="buttons-container flex items-center justify-evenly w-full mt-5">
            <button
              className="cancel-button bg-yahoo-light-purple bg-opacity-50 text-sm lg:text-base cursor-pointer p-2 rounded-md"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className={`rename-button bg-yahoo-purple bg-opacity-50 text-sm lg:text-base cursor-pointer p-2 rounded-md ${
                newName === "" ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => renameFolder(newName)}
            >
              Rename
            </button>
          </div>
        </div>
      </div>
    );
  });

  function expandFolderOptions(activeFolder) {
    return (
      folderList.find((folder) => folder === activeFolder) && ( // Use find instead of map
        <div className="folder-options-container w-full">
          <div className="folder-options flex items-center justify-evenly w-full">
            <p
              className="folder-option text-yahoo-white bg-red-500 bg-opacity-50 text-sm lg:text-base cursor-pointer p-1 rounded-md"
              onClick={() => confirmDelete(activeFolder)}
            >
              Delete
            </p>
            <p
              className="folder-option text-yahoo-white bg-yahoo-light-purple bg-opacity-50 text-sm lg:text-base cursor-pointer p-1 rounded-md"
              onClick={() => handleRenameClick(activeFolder)}
            >
              Rename
            </p>
          </div>
        </div>
      )
    );
  }

  const addFolder = () => {
    setFolderList([...folderList, "new folder"]);
  };

  const handleOpenModal = () => {
    setShowProfileModal(!showProfileModal);
  };

  useEffect(() => {
    setFolderList(["inbox", "drafts", "sent", "trash"]);
    const mockEmails = [
      {
        sender_id: 1,
        recipient_id: 2,
        subject: "Test email",
        body: "This is a test email.",
        original_language: "en",
        translated_body: "Esto es un correo de prueba.",
        sent_at: "random date",
        received_at: "random date",
        is_sent: true,
        is_urgent: true,
      },
      {
        sender_id: 2,
        recipient_id: 2,
        subject: "Test email",
        body: "This is a test email.",
        original_language: "en",
        translated_body: "Esto es un correo de prueba.",
        sent_at: "random date",
        received_at: "random date",
        is_sent: true,
        is_urgent: true,
      },
      {
        sender_id: 3,
        recipient_id: 1,
        subject: "Test email",
        body: "This is a test email cdfcccc cccccc cccccc cccccccc cc cccc cccc ccccc cccc ccc cccc ccc.",
        original_language: "en",
        translated_body: "Esto es un correo de prueba.",
        sent_at: "random date",
        received_at: "random date",
        is_sent: true,
        is_urgent: true,
      },
    ];
    setListOfEmails(mockEmails);
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

  const handleSelectAllEmailsOnPage = () => { };
  
  const truncateBody = (body) => {
    if (body.length > 22) {
      return body.substring(0, 22) + "...";
    }
    return body;
  };

  return (
    <div className="inbox-view h-screen w-full overflow-y-hidden font-poppins">
      <Navbar showProfileModal={handleOpenModal} userProfile={userProfile} />
      {showProfileModal && (
        <div className="profile-modal-overlay">
          <Profile
            userProfile={userProfile}
            setShowProfileModal={setShowProfileModal}
          />
        </div>
      )}
      <div className="body-content h-full grid grid-cols-6 lg:grid-cols-8">
        <div className="sidebar col-span-1 lg:col-span-1 grid grid-rows-34 bg-black bg-opacity-25">
          <button className="compose-button row-span-1 bg-yahoo-light-purple rounded-lg opacity-100 m-4 text-white">
            Compose
          </button>
          <div className="inbox-content-filter row-span-1 m-1 flex flex-col items-center">
            <p
              className={`text-center md:text-md lg:text-lg mt-4 w-5/6 text-yahoo-white cursor-pointer rounded-sm p-2 ${
                activeView === "inbox"
                  ? "bg-yahoo-light-purple bg-opacity-60"
                  : ""
              }`}
              onClick={() => setActiveView("inbox")}
            >
              Inbox
            </p>
            <p
              className={`text-center md:text-md lg:text-lg mt-2 w-5/6 text-yahoo-white cursor-pointer rounded-sm p-2 ${
                activeView === "sent"
                  ? "bg-yahoo-light-purple bg-opacity-60"
                  : ""
              }`}
              onClick={() => setActiveView("sent")}
            >
              Sent
            </p>
            <p
              className={`text-center md:text-md lg:text-lg mt-2 w-5/6 text-yahoo-white cursor-pointer rounded-sm p-2 ${
                activeView === "unread"
                  ? "bg-yahoo-light-purple bg-opacity-60"
                  : ""
              }`}
              onClick={() => setActiveView("unread")}
            >
              Unread
            </p>
          </div>
          <hr className="row-span-1 bg-yahoo-grey w-5/6 justify-self-center opacity-25"></hr>
          <div className="folder-content row-span-29 pl-4 lg:pl-5">
            <div className="flex justify-between">
              <p className="text-center md:text-md lg:text-lg text-yahoo-white pointer-events-none">
                Folders
              </p>
              <img
                src={folderPlus}
                alt="folder-plus"
                className="w-6 h-6 cursor-pointer mr-3 lg:mr-4"
                onClick={addFolder}
              />
            </div>
            <div className="folder-list flex flex-col">{listFolders}</div>
          </div>
        </div>
        <div className="inbox-content col-span-5 lg:col-span-7 bg-yahoo-white">
          <div className="inbox-content-header flex justify-between items-center">
            <img
              src={`${
                selectAllEmailsOnPage ? checkboxChecked : checkboxUnchecked
              }`}
              alt="select-all"
              className="w-8 h-8 cursor-pointer ml-1 mt-1"
              onClick={handleSelectAllEmailsOnPage}
            />
            <img src={folderMove} alt="folder-move" className="w-8 h-8 mt-1" />
            <img
              src={folderTrash}
              alt="folder-trash"
              className="w-8 h-8 mr-1 mt-1"
            />
          </div>
          <hr className="bg-black w-full mt-2 mb-2"></hr>
          <div className="inbox-content-body flex flex-col items-center pl-2 pr-2">
            {listOfEmails.length > 0 &&
              listOfEmails.map((email, index) => (
                <div
                  key={index} // Important for performance optimization
                  className="email-container grid grid-cols-12 grid-rows-1 items-center w-full bg-yahoo-light-purple bg-opacity-25 p-2 rounded-md mb-2"
                >
                  {/* <div className="flex items-center"> */}
                    <img
                      className="checkbox w-6 h-6 col-span-1"
                      src={`${
                        selectedEmails.includes(email.id)
                          ? checkboxChecked
                          : checkboxUnchecked
                      }`}
                      alt="checkbox"
                    />
                    <p className="sender col-start-2 col-span-1 text-ellipsis overflow-hidden">
                      {email.sender_id}
                    </p>
                    <p className="subject text-yahoo-grey col-start-3 col-span-2 text-ellipsis overflow-hidden">
                      {email.subject}
                    </p>
                  {/* </div> */}
                  <p
                    className="body text-yahoo-grey col-start-5 col-span-5 bg-white text-ellipsis overflow-hidden"
                  >
                    {truncateBody(email.body)}
                  </p>

                  <p className="date col-start-11 col-span-2 text-yahoo-grey">{email.sent_at}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      {isDeleteModalOpen && <ConfirmDeleteModal folder={activeFolder} />}
      {isRenameModalOpen && <RenameModal folder={activeFolder} />}
    </div>
  );
};

export default Inbox;
