const express = require("express");

const {
  signinController,
  checkToken,
  getUser,
  getAllUsers
} = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinController);

// check token
router.post("/checkToken", checkToken);

// get user
router.get("/getUser", getUser);

// get all users
router.get("/getAllUsers", getAllUsers);

module.exports = router;
