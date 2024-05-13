const express = require("express");

const {
  signinController,
  checkToken,
  getUser,
  getAllUsers,
  addFolder,
  deleteFolder,
  renameFolder,
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


module.exports = router;
