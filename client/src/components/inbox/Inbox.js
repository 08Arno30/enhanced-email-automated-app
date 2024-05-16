/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
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
// import someCheckboxChecked from "../../assets/add-minus-square-svgrepo-com.svg";
import goBack from "../../assets/arrow-back-basic-svgrepo-com.svg";
import emptyInbox from "../../assets/empty-inbox.svg";

//components
import Navbar from "../navbar/Navbar";
import Profile from "../profile/Profile";

const Inbox = () => {
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLanguage, setUserLanguage] = useState(null);
  const [activeView, setActiveView] = useState("Inbox");
  const [folderList, setFolderList] = useState([]);
  const [activeFolder, setActiveFolder] = useState("");
  const [showOptions, setShowOptions] = useState(
    Array(folderList.length).fill(false) // Initial state array for all folders' options
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [mainSelectorBox, setMainSelectorBox] = useState(checkboxUnchecked);
  const [listOfEmails, setListOfEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [trashedEmails, setTrashedEmails] = useState([]);
  const [emailOpened, setEmailOpened] = useState(null);
  const [activeEmail, setActiveEmail] = useState(null);
  const [showEmailComposeModal, setShowEmailComposeModal] = useState(false);
  const [inboxCheckedState, setInboxCheckedState] = useState(
    new Array(listOfEmails.length).fill(false)
  );
  const [sentCheckedState, setSentCheckedState] = useState(
    new Array(sentEmails.length).fill(false)
  );
  const [trashedCheckedState, setTrashedCheckedState] = useState(
    new Array(trashedEmails.length).fill(false)
  );
  const [emailSelected, setEmailSelected] = useState(false);
  const [userPreviousLanguage, setUserPreviousLanguage] = useState(null);
  const [componentLoader, setComponentLoader] = useState(true);
  const [showEmptyInboxMessage, setShowEmptyInboxMessage] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [folderCheckedState, setFolderCheckedState] = useState(
    new Array(folderList.length).fill(false)
  );
  const [folderEmails, setFolderEmails] = useState([]);

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
        <div
          className={`main-container flex items-center justify-between w-full ${
            activeView === folder
              ? "bg-yahoo-light-purple bg-opacity-60 rounded-tl-md rounded-bl-sm"
              : ""
          }`}
        >
          <div
            className="folder-main-container flex items-center justify-between w-full cursor-pointer"
            onClick={() => handleActiveView(folder)}
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

  const deleteFolder = async (folder, index) => {
    const folderName = folderList[index];

    if (folderName === activeFolder) {
      const response = await API.deleteFolder(userId, folderName);

      if (response.success) {
        // remove the folder from folderList and remove the corresponding option
        setFolderList((prevList) => prevList.filter((f) => f !== folder));
        setShowOptions((prevOptions) =>
          prevOptions.filter((_, index) => index !== folderList.indexOf(folder))
        );
        // set all options false
        setShowOptions(Array(folderList.length).fill(false));
        setIsDeleteModalOpen(false);

        toast.success("Folder deleted successfully!");
      }
    } else {
      return;
    }
  };

  const ConfirmDeleteModal = React.memo(({ folder, index }) => {
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
              onClick={() => deleteFolder(folder, index)}
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

  const renameFolder = async (oldname, newFolderName, index) => {
    if (newFolderName === "") {
      return;
    }

    const oldFolderNameIndex = folderList.indexOf(oldname);
    const oldFolderName = folderList[oldFolderNameIndex];

    if (newFolderName === oldFolderName) {
      return;
    }

    const response = await API.renameFolder(
      userId,
      oldFolderName,
      newFolderName
    );

    if (response.status === "success") {
      setFolderList((prevList) =>
        prevList.map((folder, i) => (i === index ? newFolderName : folder))
      );
      setIsRenameModalOpen(false);
      setActiveFolder("");
      setShowOptions(Array(folderList.length).fill(false));
      setNewName("");

      toast.success("Folder renamed successfully!");
    }

    return response;
  };

  const handleRenameKeyDown = (e, oldName, index) => {
    if (e.code === "Enter") {
      renameFolder(oldName, newName, index); // Trigger renaming on Enter
      e.preventDefault();
    }
  };

  const RenameModal = React.memo(({ folder, index }) => {
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
              onKeyDown={(e) => handleRenameKeyDown(e, folder, index)}
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
              onClick={() => renameFolder(folder, newName, index)}
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

  // Helper function to format the email date
  const formatEmailDate = (timestamp, preferred_language) => {
    const emailDate = new Date(timestamp);
    const today = new Date();

    const within24Hours =
      // Check if hours difference is less than 24
      Math.abs(today.getHours() - emailDate.getHours()) < 24 &&
      emailDate.getMonth() === today.getMonth() &&
      emailDate.getFullYear() === today.getFullYear();

    const sameYear = emailDate.getFullYear() === today.getFullYear();

    if (within24Hours) {
      let dateString = "";
      const time = emailDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Disable AM/PM
      });

      dateString.concat(time);

      if (emailOpened) {
        const hoursPassed = Math.floor((today - emailDate) / (1000 * 60 * 60));
        const minutesPassed = Math.floor((today - emailDate) / (1000 * 60));
        const secondsPassed = Math.floor((today - emailDate) / 1000);

        if (hoursPassed < 1) {
          if (minutesPassed < 1) {
            return dateString.concat(` (${secondsPassed} seconds ago)`);
          }
          return dateString.concat(` (${minutesPassed} minutes ago)`);
        }

        const sameDay = today.getDate() === emailDate.getDate();
        if (sameDay) {
          const weekDay = new Intl.DateTimeFormat(preferred_language, {
            weekday: "short",
          });
          return dateString.concat(
            `${weekDay.format(emailDate)}, ${time} (${hoursPassed} hours ago)`
          );
        } else {
          return dateString.concat(`${time} (${hoursPassed} hours ago)`);
        }
      }

      return emailDate.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
      });
    } else if (sameYear) {
      let dateString = "";

      if (emailOpened) {
        const daysPassed = Math.floor(
          (today - emailDate) / (1000 * 60 * 60 * 24)
        );
        const monthsPassed = Math.floor(
          (today - emailDate) / (1000 * 60 * 60 * 24 * 30)
        );
        const date = new Intl.DateTimeFormat(preferred_language, {
          day: "2-digit",
          month: "short",
        });
        const time = emailDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Disable AM/PM
        });

        dateString.concat(date.format(emailDate), ", ", time);

        if (monthsPassed < 1) {
          dateString.concat(` (${daysPassed} days ago)`);
        } else {
          const weekDay = new Intl.DateTimeFormat(preferred_language, {
            weekday: "short",
          });

          dateString = weekDay.format(emailDate);
          dateString.concat(", ", date, ", ", time);
        }

        return dateString;
      }

      return new Intl.DateTimeFormat(preferred_language, {
        day: "2-digit",
        month: "long",
      }).format(emailDate);
    } else {
      let dateString = "";

      if (emailOpened) {
        const date = new Intl.DateTimeFormat(preferred_language, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const time = emailDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Disable AM/PM
        });

        dateString.concat(date.format(emailDate), ", ", time);

        return dateString;
      }

      return emailDate.toLocaleDateString(preferred_language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  const handleEmailTrashOrFolderId = (email, index) => {
    if (!emailOpened) {
      if (email.sender_id === userEmail) {
        return (
          <>
            {folderList.includes(activeView) && (
              <>
                <input
                  type="checkbox"
                  id={`email-${index}`}
                  checked={folderCheckedState[index]}
                  onChange={() => handleSelectEmail(index)}
                />
                <p
                  className="sender whitespace-nowrap w-full text-ellipsis overflow-hidden ml-3"
                  onClick={() => handleOpenEmail(email)}
                >
                  to: {email.recipient_id}
                </p>
              </>
            )}
            {!folderList.includes(activeView) && (
              <>
                <input
                  type="checkbox"
                  id={`email-${index}`}
                  checked={trashedCheckedState[index]}
                  onChange={() => handleSelectEmail(index)}
                />
                <p
                  className="sender whitespace-nowrap w-full text-ellipsis overflow-hidden ml-3"
                  onClick={() => handleOpenEmail(email)}
                >
                  to: {email.recipient_id}
                </p>
              </>
            )}
          </>
        );
      } else {
        return (
          <>
            {folderList.includes(activeView) && (
              <>
                <input
                  type="checkbox"
                  id={`email-${index}`}
                  checked={folderCheckedState[index]}
                  onChange={() => handleSelectEmail(index)}
                />
                <p
                  className="sender whitespace-nowrap w-full text-ellipsis overflow-hidden ml-3"
                  onClick={() => handleOpenEmail(email)}
                >
                  from: {email.sender_id}
                </p>
              </>
            )}
            {!folderList.includes(activeView) && (
              <>
                <input
                  type="checkbox"
                  id={`email-${index}`}
                  checked={trashedCheckedState[index]}
                  onChange={() => handleSelectEmail(index)}
                />
                <p
                  className="sender whitespace-nowrap w-full text-ellipsis overflow-hidden ml-3"
                  onClick={() => handleOpenEmail(email)}
                >
                  from: {email.sender_id}
                </p>
              </>
            )}
          </>
        );
      }
    } else {
      if (email.sender_id === userEmail) {
        return (
          <>
            <p className="sender text-yahoo-grey">To: </p>
            <p className="sender ml-5">{email.recipient_id}</p>
          </>
        );
      } else {
        return (
          <>
            <p className="sender text-yahoo-grey">From: </p>
            <p className="sender ml-5">{email.sender_id}</p>
          </>
        );
      }
    }
  };

  const EmailListContainer = React.memo(({ listOfEmails }) => {
    return (
      <>
        {listOfEmails.length > 0 &&
          listOfEmails.map((email, index) => (
            <div
              key={index} // Important for performance optimization
              className="email-container cursor-pointer grid grid-cols-12 grid-rows-1 items-center w-full bg-yahoo-light-purple bg-opacity-25 p-2 rounded-md mb-2"
            >
              <span className="col-start-1 col-span-2 flex items-center">
                {/* <img
                  className="checkbox w-6 h-6 col-span-1 cursor-default"
                  src={selectedEmailImage}
                  alt="checkbox"
                  onClick={() => handleSelectEmail(index)}
                /> */}
                {activeView === "Inbox" && (
                  <>
                    <input
                      type="checkbox"
                      id={`email-${index}`}
                      checked={inboxCheckedState[index]}
                      onChange={() => handleSelectEmail(index)}
                    />
                    <p
                      className="sender whitespace-nowrap w-full text-ellipsis overflow-hidden ml-3"
                      onClick={() => handleOpenEmail(email)}
                    >
                      {email.sender_id}
                    </p>
                  </>
                )}
                {activeView === "Sent" && (
                  <>
                    <input
                      type="checkbox"
                      id={`email-${index}`}
                      checked={sentCheckedState[index]}
                      onChange={() => handleSelectEmail(index)}
                    />
                    <p
                      className="sender whitespace-nowrap w-full text-ellipsis overflow-hidden ml-3"
                      onClick={() => handleOpenEmail(email)}
                    >
                      to: {email.recipient_id}
                    </p>
                  </>
                )}
                {(activeView === "Trash" || folderList.includes(activeView)) &&
                  handleEmailTrashOrFolderId(email, index)}
              </span>
              <span
                className="flex items-center w-full col-start-3 col-span-9 ml-8"
                onClick={() => handleOpenEmail(email)}
              >
                <p className="subject text-yahoo-grey whitespace-nowrap w-full text-ellipsis overflow-hidden">
                  {email.subject} - {email.body}
                </p>
                <p className="body text-yahoo-grey "></p>
              </span>

              <p
                className="date col-start-12 col-span-1 text-sm text-yahoo-grey"
                onClick={() => handleOpenEmail(email)}
              >
                {formatEmailDate(email.sent_at, userLanguage)}
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
              {activeView === "Inbox" && (
                <p className="sender text-yahoo-grey">From: </p>
              )}
              {activeView === "Sent" && (
                <p className="sender text-yahoo-grey">To: </p>
              )}
              {activeView === "Inbox" && (
                <p className="sender ml-5">{email.sender_id}</p>
              )}
              {activeView === "Sent" && (
                <p className="sender ml-5">{email.recipient_id}</p>
              )}
              {(activeView === "Trash" || folderList.includes(activeView)) &&
                handleEmailTrashOrFolderId(email)}
            </span>
            <span className="date text-yahoo-grey">
              {formatEmailDate(email.sent_at, userLanguage)}
            </span>
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

  const addFolder = async () => {
    let counter = 0;

    counter = folderList.length + 1;
    const newFolderName = `new-folder-${counter}`;

    // update user's folders
    const response = await API.addFolder(userId, newFolderName);

    if (!response || response.result.acknowledged === false) {
      return;
    }

    // update state
    setFolderList([...folderList, newFolderName]);
  };

  const handleOpenModal = () => {
    setShowProfileModal(!showProfileModal);
  };

  useEffect(() => {
    if (componentLoader) {
      if (showInitialLoader) {
        setTimeout(() => {
          setShowInitialLoader(false);
          setComponentLoader(false);
          setShowEmptyInboxMessage(true);
        }, 2000);
      } else {
        setTimeout(() => {
          setComponentLoader(false);
          setShowEmptyInboxMessage(true);
        }, 2000);
      }
    }
    if (Cookies.get("jwt")) {
      // test if token is still valid
      const testToken = async () => {
        const response = await API.checkToken(Cookies.get("jwt"));

        if (!response.valid) {
          Cookies.remove("jwt");
          window.location.reload();
        }
      };

      testToken();

      const testUser = async () => {
        const response = await API.getUser(Cookies.get("jwt"));

        if (!response || !response.user) {
          Cookies.remove("jwt");
          window.location.reload();
        }
      };

      testUser();

      const getUserData = async () => {
        const response = await API.getUser(Cookies.get("jwt"));

        if (response && response.user) {
          setUserProfile(response.user);
          setUserEmail(response.user.email);
          setUserId(response.user._id);
          setUserLanguage(response.user.preferred_language);
          setFolderList(response.user.folders);

          // set emails
          const emailsResponseAll = await API.getEmails(response.user._id);
          const emailsResponse = emailsResponseAll.result.filter((email) => {
            // Find a matching email in response.user.emails
            const matchingUserEmail = response.user.emails.find(
              (userEmails) =>
                userEmails._id === email._id && !userEmails.is_deleted
            );

            // Return true if a matching email is found and is not deleted
            return matchingUserEmail !== undefined;
          });

          if (emailsResponse) {
            const uniqueEmails = new Set();
            const finalEmailsList = [];

            const senderPromises = emailsResponse.map(async (email) => {
              const senderResponse = await API.getUser(
                Cookies.get("jwt"),
                null,
                email.sender_id
              );
              if (senderResponse && senderResponse.user) {
                email.sender_id = senderResponse.user.email;
                return email;
              }
              return null;
            });

            const resolvedEmails = await Promise.all(senderPromises);

            resolvedEmails.forEach((email) => {
              if (email && !uniqueEmails.has(email._id)) {
                uniqueEmails.add(email._id);
                finalEmailsList.push(email);
              }
            });

            // sort emails by date
            finalEmailsList.sort(
              (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
            );

            const translatedListOfEmailsPromises = finalEmailsList.map(
              async (email) => {
                const translatedSubject = await API.translate(
                  email.subject,
                  userPreviousLanguage || "en",
                  userLanguage
                );

                const translatedBody = await API.translate(
                  email.body,
                  userPreviousLanguage || "en",
                  userLanguage
                );

                return {
                  ...email,
                  subject: translatedSubject.translatedText,
                  body: translatedBody.translatedText,
                };
              }
            );

            const translatedListOfEmails = await Promise.all(
              translatedListOfEmailsPromises
            );

            setListOfEmails(translatedListOfEmails);
            setInboxCheckedState(
              new Array(translatedListOfEmails.length).fill(false)
            );

            const allEmailsResponse = await API.getAllEmails();

            if (allEmailsResponse && allEmailsResponse.result) {
              const sentEmailsResponse = allEmailsResponse.result.filter(
                (email) =>
                  email.sender_id === userId && email.is_deleted === false
              );

              const sentEmails = sentEmailsResponse.filter((email) => {
                // Find a matching email in response.user.emails
                const matchingUserEmail = response.user.emails.find(
                  (userEmails) =>
                    userEmails._id === email._id && !userEmails.is_deleted
                );

                // Return true if a matching email is found and is not deleted
                return matchingUserEmail !== undefined;
              });

              // Promise array to hold recipient email fetches
              const recipientEmailPromises = sentEmails.map(async (email) => {
                return await API.getUser(
                  Cookies.get("jwt"),
                  null,
                  email.recipient_id
                );
              });

              // Wait for all recipient email fetches to complete
              const recipientEmails = await Promise.all(recipientEmailPromises);

              // Modify sentEmails based on fetched recipient emails
              const modifiedSentEmails = sentEmails.map((email, index) => {
                return {
                  ...email,
                  sender_id: userEmail,
                  recipient_id: recipientEmails[index].user.email,
                };
              });

              // sort sentEmails by date
              modifiedSentEmails.sort(
                (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
              );

              const translatedSentEmailsPromises = modifiedSentEmails.map(
                async (email) => {
                  const translatedSubject = await API.translate(
                    email.subject,
                    userPreviousLanguage || "en",
                    userLanguage
                  );

                  const translatedBody = await API.translate(
                    email.body,
                    userPreviousLanguage || "en",
                    userLanguage
                  );

                  return {
                    ...email,
                    subject: translatedSubject.translatedText,
                    body: translatedBody.translatedText,
                  };
                }
              );

              const translatedSentEmails = await Promise.all(
                translatedSentEmailsPromises
              );

              setSentEmails(translatedSentEmails);
              setSentCheckedState(
                new Array(translatedSentEmails.length).fill(false)
              );
            }

            if (allEmailsResponse && allEmailsResponse.result) {
              const deletedEmailsResponse = allEmailsResponse.result.filter(
                (email) =>
                  email.recipient_id === userId || email.sender_id === userId
              );
              const deletedEmails = deletedEmailsResponse.filter((email) => {
                // Find a matching email in response.user.emails
                const matchingUserEmail = response.user.emails.find(
                  (userEmails) =>
                    userEmails._id === email._id && userEmails.is_deleted
                );

                // Return true if a matching email is found and is not deleted
                return matchingUserEmail !== undefined;
              });

              // Promise array to hold recipient email fetches
              const recipientEmailPromises = deletedEmails.map(
                async (email) => {
                  return await API.getUser(
                    Cookies.get("jwt"),
                    null,
                    email.recipient_id
                  );
                }
              );

              // Wait for all recipient email fetches to complete
              const recipientEmails = await Promise.all(recipientEmailPromises);

              // Promise array to hold recipient email fetches
              const senderEmailPromises = deletedEmails.map(async (email) => {
                return await API.getUser(
                  Cookies.get("jwt"),
                  null,
                  email.sender_id
                );
              });

              // Wait for all sender email fetches to complete
              const senderEmails = await Promise.all(senderEmailPromises);

              // Modify deletedEmails based on fetched recipient and sender emails
              const modifiedDeletedEmails = deletedEmails.map(
                (email, index) => {
                  return {
                    ...email,
                    sender_id: senderEmails[index].user.email,
                    recipient_id: recipientEmails[index].user.email,
                  };
                }
              );

              // sort deletedEmails by date
              modifiedDeletedEmails.sort(
                (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
              );

              const translatedDeletedEmailsPromises = modifiedDeletedEmails.map(
                async (email) => {
                  const translatedSubject = await API.translate(
                    email.subject,
                    userPreviousLanguage || "en",
                    userLanguage
                  );

                  const translatedBody = await API.translate(
                    email.body,
                    userPreviousLanguage || "en",
                    userLanguage
                  );

                  return {
                    ...email,
                    subject: translatedSubject.translatedText,
                    body: translatedBody.translatedText,
                  };
                }
              );

              const translatedDeletedEmails = await Promise.all(
                translatedDeletedEmailsPromises
              );

              setTrashedEmails(translatedDeletedEmails);
              setTrashedCheckedState(
                new Array(translatedDeletedEmails.length).fill(false)
              );
            }

            if (
              allEmailsResponse &&
              allEmailsResponse.result &&
              response.user.folders.includes(activeView)
            ) {
              const emailsForFolderResponse = allEmailsResponse.result.filter(
                (email) =>
                  (email.recipient_id === userId &&
                    email.folders.includes(activeView)) ||
                  (email.sender_id === userId &&
                    email.folders.includes(activeView))
              );
              const emailsForFolder = emailsForFolderResponse.filter((email) =>
                response.user.emails.map(
                  (userEmails) => userEmails._id === email._id
                )
              );

              // Promise array to hold recipient email fetches
              const recipientEmailPromises = emailsForFolder.map(
                async (email) => {
                  return await API.getUser(
                    Cookies.get("jwt"),
                    null,
                    email.recipient_id
                  );
                }
              );

              // Wait for all recipient email fetches to complete
              const recipientEmails = await Promise.all(recipientEmailPromises);

              // Promise array to hold recipient email fetches
              const senderEmailPromises = emailsForFolder.map(async (email) => {
                return await API.getUser(
                  Cookies.get("jwt"),
                  null,
                  email.sender_id
                );
              });

              // Wait for all sender email fetches to complete
              const senderEmails = await Promise.all(senderEmailPromises);

              // Modify emailsForFolder based on fetched recipient and sender emails
              const modifiedEmailsForFolder = emailsForFolder.map(
                (email, index) => {
                  return {
                    ...email,
                    sender_id: senderEmails[index].user.email,
                    recipient_id: recipientEmails[index].user.email,
                  };
                }
              );

              // sort emailsForFolder by date
              modifiedEmailsForFolder.sort(
                (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
              );

              const translatedEmailsForFolderPromises =
                modifiedEmailsForFolder.map(async (email) => {
                  const translatedSubject = await API.translate(
                    email.subject,
                    userPreviousLanguage || "en",
                    userLanguage
                  );

                  const translatedBody = await API.translate(
                    email.body,
                    userPreviousLanguage || "en",
                    userLanguage
                  );

                  return {
                    ...email,
                    subject: translatedSubject.translatedText,
                    body: translatedBody.translatedText,
                  };
                });

              const translatedEmailsForFolder = await Promise.all(
                translatedEmailsForFolderPromises
              );

              setFolderEmails(translatedEmailsForFolder);
              setFolderCheckedState(
                new Array(translatedEmailsForFolder.length).fill(false)
              );
            }
          }
        }
      };

      getUserData();
    } else {
      window.location = "#/login-page";
    }
  }, [
    userId,
    userEmail,
    userLanguage,
    activeView,
    userPreviousLanguage,
    componentLoader,
    showInitialLoader,
  ]);

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

  const handleSelectEmail = (position) => {
    let checkedState;

    if (activeView === "Inbox") {
      checkedState = inboxCheckedState;
    } else if (activeView === "Sent") {
      checkedState = sentCheckedState;
    } else if (activeView === "Trash") {
      checkedState = trashedCheckedState;
    } else if (folderList.includes(activeView)) {
      checkedState = folderCheckedState;
    }

    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    // check if one email is selected
    let countSelected = 0;
    updatedCheckedState.forEach((isChecked) => {
      if (isChecked) {
        countSelected++;
      }
    });

    if (countSelected > 0) {
      setEmailSelected(true);
    } else {
      setEmailSelected(false);
    }

    if (activeView === "Inbox") {
      setInboxCheckedState(updatedCheckedState);
    } else if (activeView === "Sent") {
      setSentCheckedState(updatedCheckedState);
    } else if (activeView === "Trash") {
      setTrashedCheckedState(updatedCheckedState);
    } else if (folderList.includes(activeView)) {
      setFolderCheckedState(updatedCheckedState);
    }
  };

  const handleDeleteSelectedEmails = async () => {
    if (activeView === "Inbox") {
      const checkedState = inboxCheckedState;

      checkedState.forEach(async (isChecked, index) => {
        if (isChecked) {
          const response = await API.deleteEmail(
            Cookies.get("jwt"),
            listOfEmails[index]._id,
            userProfile.emails
          );
          if (response) {
            console.log("Email deleted");
          } else {
            console.log("Email not deleted");
          }

          const sentEmailIndex = sentEmails.findIndex(
            (email) => email._id === listOfEmails[index]._id
          );

          // remove email from list
          setListOfEmails(
            listOfEmails.filter((email) => email !== listOfEmails[index])
          );

          // remove email from checkedState
          setInboxCheckedState(
            checkedState.filter((item, idx) => idx !== index)
          );

          // remove email from sent list
          setSentEmails(
            sentEmails.filter((email) => email !== listOfEmails[index])
          );

          // remove email from sent checkedState
          setSentCheckedState(
            checkedState.filter((item, idx) => idx !== sentEmailIndex)
          );
        }
      });

      toast("Email(s) moved to trash", {
        icon: "🗑️",
      });
    } else if (activeView === "Sent") {
      const checkedState = sentCheckedState;

      checkedState.forEach(async (isChecked, index) => {
        if (isChecked) {
          const response = await API.deleteEmail(
            Cookies.get("jwt"),
            sentEmails[index]._id,
            userProfile.emails
          );
          if (response) {
            console.log("Email moved to bin");
          } else {
            console.log("Email not deleted");
          }

          const inboxEmailIndex = listOfEmails.findIndex(
            (email) => email._id === sentEmails[index]._id
          );

          // remove email from list
          setSentEmails(
            sentEmails.filter((email) => email !== sentEmails[index])
          );

          // remove email from checkedState
          setSentCheckedState(
            checkedState.filter((item, idx) => idx !== index)
          );

          // remove email from inbox list
          setListOfEmails(
            listOfEmails.filter((email) => email !== sentEmails[index])
          );

          // remove email from inbox checkedState
          setInboxCheckedState(
            checkedState.filter((item, idx) => idx !== inboxEmailIndex)
          );
        }
      });
      toast("Email(s) moved to trash", {
        icon: "🗑️",
      });
    } else if (activeView === "Trash") {
      const checkedState = trashedCheckedState;

      checkedState.forEach(async (isChecked, index) => {
        if (isChecked) {
          const response = await API.removeEmail(userId, trashedEmails[index]);

          if (response) {
            console.log("Email deleted permanently");
          } else {
            console.log("Email not deleted");
          }

          // remove email from list
          setTrashedEmails(
            trashedEmails.filter((email) => email !== trashedEmails[index])
          );

          // remove email from checkedState
          setTrashedCheckedState(
            checkedState.filter((item, idx) => idx !== index)
          );
        }
      });
      toast("Email(s) deleted", {
        icon: "🗑️",
      });
    }
    handleActiveView(activeView);
  };

  const handleComposeEmailCancel = () => {
    setShowEmailComposeModal(false);
  };

  const handleComposeEmailSend = async () => {
    const token = Cookies.get("jwt");
    const send_to = document.getElementById("email-to").value;
    const sent_from = userEmail;
    const reply_to = userEmail;
    const subject = document.getElementById("email-subject").value;
    const body = document.getElementById("email-body").value;

    toast("Sending email...", {
      icon: "📨",
      duration: 2000,
    });

    // translate subject and body to english
    const translatedSubject = await API.translate(subject, userLanguage, "en");
    const translatedBody = await API.translate(body, userLanguage, "en");

    const response = await API.sendEmail(
      token,
      send_to,
      sent_from,
      reply_to,
      translatedSubject.translatedText,
      translatedBody.translatedText
    );

    if (response) {
      console.log("Email sent");
      setShowEmailComposeModal(false);
      toast("Email sent", {
        icon: "✉️",
      });
    } else {
      console.log("Email not sent");
    }
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
                  id="email-to"
                  type="text"
                  placeholder="To"
                  className="border-b-2 border-yahoo-purple w-full bg-yahoo-white focus:outline-none p-2 pl-0"
                />
              </div>
              <div className="input-subject-container mb-5 bg-yahoo-white">
                <input
                  id="email-subject"
                  type="text"
                  placeholder="Subject"
                  className="border-b-2 border-yahoo-purple w-full bg-yahoo-white focus:outline-none p-2 pl-0"
                />
              </div>
              <div className="input-body-container flex flex-col bg-yahoo-white">
                <textarea
                  id="email-body"
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

  const handleActiveView = (view) => {
    setComponentLoader(true);
    setEmailSelected(false);
    setActiveView(view);

    if (view === activeView) {
      setActiveFolder("");
    } else {
      setActiveFolder(view);
    }

    setInboxCheckedState(
      inboxCheckedState.map(() => {
        return false;
      })
    );
    setSentCheckedState(
      sentCheckedState.map(() => {
        return false;
      })
    );
    setTrashedCheckedState(
      trashedCheckedState.map(() => {
        return false;
      })
    );
    setFolderCheckedState(
      folderCheckedState.map(() => {
        return false;
      })
    );
  };

  return (
    <div className="inbox-view h-screen w-full overflow-y-hidden font-poppins">
      <div>
        <Toaster />
      </div>
      <Navbar showProfileModal={handleOpenModal} userProfile={userProfile} />
      {showProfileModal && (
        <div className="profile-modal-overlay">
          <Profile
            userProfile={userProfile}
            setShowProfileModal={setShowProfileModal}
            userId={userId}
            userLanguage={userLanguage}
            setUserLanguage={setUserLanguage}
            setUserPreviousLanguage={setUserPreviousLanguage}
          />
        </div>
      )}
      <div className="body-content h-full grid grid-cols-6 lg:grid-cols-8">
        <div className="sidebar col-span-1 lg:col-span-1 grid grid-rows-34 bg-black bg-opacity-25 h-screen">
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
                activeView === "Inbox"
                  ? "bg-yahoo-light-purple bg-opacity-60"
                  : ""
              }`}
              onClick={() => handleActiveView("Inbox")}
            >
              Inbox
            </p>
            <p
              className={`text-center md:text-md lg:text-lg mt-2 w-5/6 text-yahoo-white cursor-pointer rounded-sm p-2 ${
                activeView === "Sent"
                  ? "bg-yahoo-light-purple bg-opacity-60"
                  : ""
              }`}
              onClick={() => handleActiveView("Sent")}
            >
              Sent
            </p>
            <p
              className={`text-center md:text-md lg:text-lg mt-2 w-5/6 text-yahoo-white cursor-pointer rounded-sm p-2 ${
                activeView === "Trash"
                  ? "bg-yahoo-light-purple bg-opacity-60"
                  : ""
              }`}
              onClick={() => handleActiveView("Trash")}
            >
              Trash
            </p>
            {/* <p
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
          {!emailOpened && (
            <div className="inbox-content-header flex justify-start items-center">
              {/* <img
                src={`${mainSelectorBox}`}
                alt="select-all"
                className="w-8 h-8 cursor-pointer ml-1 mt-1 pointer-events-none"
                // onClick={() => handleSelectAllEmailsOnPage()}
              /> */}
              <p className="text-xl font-medium flex items-center mt-2 ml-3">
                {activeView}
              </p>
              <hr className="bg-yahoo-grey opacity-50 w-7 rotate-90 mt-1 h-0.5"></hr>

              {/* <span className="flex items-center justify-between ml-3">
                <p
                  className={`mr-3 mt-2 ${
                    emailSelected
                      ? "cursor-pointer opacity-100"
                      : "pointer-events-none opacity-30"
                  }`}
                >
                  Move
                </p>
                <img
                  src={folderMove}
                  alt="folder-move"
                  className={`w-8 h-8 mt-1 ${
                    emailSelected
                      ? "cursor-pointer opacity-100"
                      : "pointer-events-none opacity-30"
                  }`}
                />
              </span> */}

              <span className="flex items-center justify-between ml-6">
                <p
                  className={`mr-2 mt-2 ${
                    emailSelected
                      ? "cursor-pointer opacity-100"
                      : "pointer-events-none opacity-30"
                  }`}
                  onClick={() => handleDeleteSelectedEmails()}
                >
                  Delete
                </p>
                <img
                  src={folderTrash}
                  alt="folder-trash"
                  className={`w-8 h-8 mt-1 ${
                    emailSelected
                      ? "cursor-pointer opacity-100"
                      : "pointer-events-none opacity-30"
                  }`}
                  onClick={() => handleDeleteSelectedEmails()}
                />
              </span>
            </div>
          )}
          <hr className="bg-black w-full mt-2 mb-2"></hr>
          {showInitialLoader && (
            <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
              <div className="loader w-full h-1 z-50"></div>
            </div>
          )}
          {!emailOpened &&
            activeView === "Inbox" &&
            listOfEmails.length > 0 && (
              <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
                {componentLoader ? (
                  <div className="loader w-full h-1 z-50"></div>
                ) : (
                  <EmailListContainer listOfEmails={listOfEmails} />
                )}
              </div>
            )}
          {!emailOpened &&
            activeView === "Inbox" &&
            listOfEmails.length === 0 &&
            showEmptyInboxMessage && (
              <>
                {componentLoader ? (
                  <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
                    <div className="loader w-full h-1 z-50"></div>
                  </div>
                ) : (
                  <div className="inbox-content-body h-4/5 flex flex-col items-center justify-center pl-2 pr-2">
                    <img
                      src={emptyInbox}
                      alt="empty-inbox"
                      className="w-1/3 lg:w-1/4"
                    />
                    <div className="text-center">
                      <p className="text-lg lg:text-2xl text-yahoo-grey">
                        No emails in this inbox
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          {!emailOpened && activeView === "Sent" && sentEmails.length > 0 && (
            <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
              {componentLoader ? (
                <div className="loader w-full h-1 z-50"></div>
              ) : (
                <EmailListContainer listOfEmails={sentEmails} />
              )}
            </div>
          )}
          {!emailOpened &&
            activeView === "Sent" &&
            sentEmails.length === 0 &&
            showEmptyInboxMessage && (
              <>
                {componentLoader ? (
                  <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
                    <div className="loader w-full h-1 z-50"></div>
                  </div>
                ) : (
                  <div className="inbox-content-body h-4/5 flex flex-col items-center justify-center pl-2 pr-2">
                    <img
                      src={emptyInbox}
                      alt="empty-inbox"
                      className="w-1/3 lg:w-1/4"
                    />
                    <div className="text-center">
                      <p className="text-lg lg:text-2xl text-yahoo-grey">
                        No emails in this inbox
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          {!emailOpened &&
            activeView === "Trash" &&
            trashedEmails.length > 0 && (
              <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
                {componentLoader ? (
                  <div className="loader w-full h-1 z-50"></div>
                ) : (
                  <EmailListContainer listOfEmails={trashedEmails} />
                )}
              </div>
            )}
          {!emailOpened &&
            activeView === "Trash" &&
            trashedEmails.length === 0 &&
            showEmptyInboxMessage && (
              <>
                {componentLoader ? (
                  <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
                    <div className="loader w-full h-1 z-50"></div>
                  </div>
                ) : (
                  <div className="inbox-content-body h-4/5 flex flex-col items-center justify-center pl-2 pr-2">
                    <img
                      src={emptyInbox}
                      alt="empty-inbox"
                      className="w-1/3 lg:w-1/4"
                    />
                    <div className="text-center">
                      <p className="text-lg lg:text-2xl text-yahoo-grey">
                        No emails in this inbox
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          {!emailOpened &&
            folderList.includes(activeView) &&
            folderEmails.length > 0 && (
              <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
                {componentLoader ? (
                  <div className="loader w-full h-1 z-50"></div>
                ) : (
                  <EmailListContainer listOfEmails={folderEmails} />
                )}
              </div>
            )}
          {!emailOpened &&
            folderList.includes(activeView) &&
            folderEmails.length === 0 &&
            showEmptyInboxMessage && (
              <>
                {componentLoader ? (
                  <div className="inbox-content-body flex flex-col items-center pl-2 pr-2 max-h-screen overflow-y-scroll">
                    <div className="loader w-full h-1 z-50"></div>
                  </div>
                ) : (
                  <div className="inbox-content-body h-4/5 flex flex-col items-center justify-center pl-2 pr-2">
                    <img
                      src={emptyInbox}
                      alt="empty-inbox"
                      className="w-1/3 lg:w-1/4"
                    />
                    <div className="text-center">
                      <p className="text-lg lg:text-2xl text-yahoo-grey">
                        No emails in this inbox
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          {emailOpened && <EmailView email={activeEmail} />}
        </div>
      </div>
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          folder={activeFolder}
          index={folderList.indexOf(activeFolder)}
        />
      )}
      {isRenameModalOpen && (
        <RenameModal
          folder={activeFolder}
          index={folderList.indexOf(activeFolder)}
        />
      )}
      {showEmailComposeModal && <EmailComposeModal />}
    </div>
  );
};

export default Inbox;
