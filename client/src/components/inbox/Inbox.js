/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as API from "../../api/index";
import "./Inbox.css";
import folderClose from "../../assets/folder-close-svgrepo-com.svg";
import folderOpen from "../../assets/folder-open-svgrepo-com.svg";
import folderPlus from "../../assets/folder-plus-svgrepo-com.svg";
import folderOptions from "../../assets/options-svgrepo-com.svg";
// import folderMove from "../../assets/upload-folder-svgrepo-com.svg";
// import folderTrash from "../../assets/trash-svgrepo-com.svg";
// import checkboxUnchecked from "../../assets/checkbox-unchecked-svgrepo-com.svg";
// import checkboxChecked from "../../assets/checkbox-checked-svgrepo-com.svg";
// import someCheckboxChecked from "../../assets/add-minus-square-svgrepo-com.svg";
import goBack from "../../assets/arrow-back-basic-svgrepo-com.svg";

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
  // const [mainSelectorBox, setMainSelectorBox] = useState(checkboxUnchecked);
  const [listOfEmails, setListOfEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailOpened, setEmailOpened] = useState(null);
  const [activeEmail, setActiveEmail] = useState(null);
  const [showEmailComposeModal, setShowEmailComposeModal] = useState(false);

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

  const handleOpenEmail = (email) => {
    setEmailOpened(true);
    setActiveEmail(email);
  };

  const EmailListContainer = React.memo(({ selectedEmails, listOfEmails }) => {
    return (
      <>
        {listOfEmails.length > 0 &&
          listOfEmails.map((email, index) => (
            <div
              key={index} // Important for performance optimization
              className="email-container cursor-pointer grid grid-cols-12 grid-rows-1 items-center w-full bg-yahoo-light-purple bg-opacity-25 p-2 rounded-md mb-2"
              onClick={() => handleOpenEmail(email)}
            >
              <span className="col-start-1 col-span-1 flex items-center">
                {/* <img
                  className="checkbox w-6 h-6 col-span-1 cursor-default"
                  src={`${
                    selectedEmails.includes(email)
                      ? checkboxChecked
                      : checkboxUnchecked
                  }`}
                  alt="checkbox"
                  onClick={() => handleSelectEmail(email)}
                /> */}
                <p className="sender whitespace-nowrap w-full text-ellipsis overflow-hidden ml-3">
                  {email.sender_id}
                </p>
              </span>
              <span className="flex items-center w-full col-start-2 col-span-9 ml-8">
                <p className="subject text-yahoo-grey whitespace-nowrap w-full text-ellipsis overflow-hidden">
                  {email.subject} - {email.body}
                </p>
                <p className="body text-yahoo-grey "></p>
              </span>

              <p className="date col-start-12 col-span-1 text-sm text-yahoo-grey">
                {email.sent_at}
              </p>
            </div>
          ))}
      </>
    );
  });

  const handleClosedEmail = () => {
    setEmailOpened(false);
    setActiveEmail(null);
  };

  const EmailView = React.memo(({ email }) => {
    return (
      <div className="email-content-container bg-yahoo-white p-5 rounded-md">
        <div className="header flex items-center justify-between w-full">
          <img
            src={goBack}
            className="w-6 h-6 cursor-pointer"
            alt="go back"
            onClick={() => handleClosedEmail()}
          />
        </div>
        <p className="subject flex items-center justify-center text-xl font-bold">
          {email.subject}
        </p>
        <div className="email-content mt-10 ml-10">
          <div className="email-content-header flex items-center justify-between w-full">
            <span className="sender flex items-center">
              <p className="sender text-yahoo-grey">From: </p>
              <p className="sender ml-5">{email.sender_id}</p>
            </span>
            <span className="date text-yahoo-grey">{email.sent_at}</span>
          </div>
          <p className="body mt-16 ml-20 pr-24">{email.body}</p>
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
        body: "Please find attached a copy of your payment notification. How to open your payment notification? In order to open your payment notification you will need Adobe Reader installed on your computer. If you don't have Adobe Reader installed on your computer, please refer to the Adobe Website to download. Please do not reply as this was sent from an unattended mailbox. Kind Regards, Payment Notifications",
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

  // const handleSelectAllEmailsOnPage = () => {
  //   if (selectedEmails.length === listOfEmails.length) {
  //     setSelectedEmails(() => []);
  //     setMainSelectorBox(checkboxUnchecked);
  //   } else if (selectedEmails.length > 0) {
  //     if (mainSelectorBox !== someCheckboxChecked) {
  //       setMainSelectorBox(() => someCheckboxChecked);
  //     } else {
  //       setMainSelectorBox(checkboxUnchecked);
  //       setSelectedEmails(() => []);
  //     }
  //   } else {
  //     setSelectedEmails(listOfEmails.map((email) => email));
  //     setMainSelectorBox(() => checkboxChecked);
  //   }
  // };

  // const handleSelectEmail = (email) => {
  //   // only select the email that was clicked
  //   if (selectedEmails.includes(email)) {
  //     setSelectedEmails((prevList) =>
  //       prevList.filter((prevEmail) => prevEmail !== email)
  //     );
  //   } else {
  //     setSelectedEmails((prevList) => [...prevList, email]);
  //   }

  //   if (selectedEmails.length === 0) {
  //     setMainSelectorBox(() => checkboxUnchecked);
  //   } else if (selectedEmails.length === listOfEmails.length) {
  //     setMainSelectorBox(() => checkboxChecked);
  //   } else {
  //     setMainSelectorBox(() => someCheckboxChecked);
  //   }
  // };

  const handleComposeEmailCancel = () => {
    setShowEmailComposeModal(false);
  };

  const handleComposeEmailSend = () => {
    setShowEmailComposeModal(false);
  };

  const handleComposeEmail = () => {
    setShowEmailComposeModal(true);
  };

  const EmailComposeModal = React.memo(() => {
    return (
      <div
        id="compose-view"
        className="compose-view z-40 bg-black bg-opacity-50 fixed top-0 left-0 w-full h-screen overflow-auto flex items-center justify-center transition-all duration-300 ease-in-out"
      >
        <div className="compose-email-container z-50 bg-yahoo-white rounded-2xl shadow-2xl p-5 w-1/2 h-1/2 flex flex-col justify-between">
          <div className="main-content">
            <div className="compose-email-header flex justify-between">
              <h1 className="text-4xl font-bold text-yahoo-purple">
                Compose Email
              </h1>
            </div>
            <div className="compose-email-body mt-10">
              <div className="input-to-container flex mb-2">
                <input
                  type="text"
                  placeholder="To"
                  className="border-b-2 border-yahoo-purple w-full bg-yahoo-white focus:outline-none p-2 pl-0"
                />
              </div>
              <div className="input-subject-container mb-5 bg-yahoo-white">
                <input
                  type="text"
                  placeholder="Subject"
                  className="border-b-2 border-yahoo-purple w-full bg-yahoo-white focus:outline-none p-2 pl-0"
                />
              </div>
              <div className="input-body-container flex flex-col bg-yahoo-white">
                <textarea
                  type="text"
                  placeholder="Body"
                  className=" w-full bg-yahoo-white resize-none h-48 focus:outline-none p-2 pl-0"
                />
              </div>
            </div>
          </div>
          <div className="compose-email-footer flex justify-between">
            <button
              className="text-2xl font-bold text-yahoo-purple cursor-pointer z-50"
              onClick={() => handleComposeEmailCancel()}
            >
              Cancel
            </button>
            <button
              className="text-2xl font-bold text-yahoo-purple"
              onClick={() => handleComposeEmailSend()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  });

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
          <button
            className={`compose-button row-span-1 bg-yahoo-light-purple rounded-lg opacity-100 m-4 text-white ${
              showEmailComposeModal ? "pointer-events-none" : ""
            }`}
            onClick={() => handleComposeEmail()}
          >
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
            {/* <p
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
            </p> */}
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
            {/* <img
              src={`${mainSelectorBox}`}
              alt="select-all"
              className="w-8 h-8 cursor-pointer ml-1 mt-1 pointer-events-none"
              // onClick={() => handleSelectAllEmailsOnPage()}
            />
            <img src={folderMove} alt="folder-move" className="w-8 h-8 mt-1" />
            <img
              src={folderTrash}
              alt="folder-trash"
              className="w-8 h-8 mr-1 mt-1"
            /> */}
          </div>
          <hr className="bg-black w-full mt-2 mb-2"></hr>
          {!emailOpened && (
            <div className="inbox-content-body flex flex-col items-center pl-2 pr-2">
              <EmailListContainer
                // selectedEmails={selectedEmails}
                listOfEmails={listOfEmails}
              />
            </div>
          )}
          {emailOpened && <EmailView email={activeEmail} />}
        </div>
      </div>
      {isDeleteModalOpen && <ConfirmDeleteModal folder={activeFolder} />}
      {isRenameModalOpen && <RenameModal folder={activeFolder} />}
      {showEmailComposeModal && <EmailComposeModal />}
    </div>
  );
};

export default Inbox;
