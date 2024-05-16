const express = require("express");

const {
  signinController,
  checkToken,
  getUser,
  getAllUsers,
  addFolder,
  deleteFolder,
  renameFolder,
  updateLanguage,
  addEmail,
  removeEmail,
  updateEmail
} = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinController);

// check token
router.post("/checkToken", checkToken);

// add folder
router.put("/addFolder", addFolder);

// delete folder
router.put("/deleteFolder", deleteFolder);

// rename folder
router.put("/renameFolder", renameFolder);

// get user
router.get("/getUser", getUser);

// get all users
router.get("/getAllUsers", getAllUsers);

// update language
router.put("/updateLanguage", updateLanguage);

// add email
router.put("/addEmail", addEmail);

// remove email
router.put("/removeEmail", removeEmail);

// update emails
router.put("/updateEmail", updateEmail);

module.exports = router;
