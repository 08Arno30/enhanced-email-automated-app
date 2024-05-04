const express = require("express");

const {
  signinController,
  checkToken
} = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinController);

// check token
router.post("/checkToken", checkToken);

module.exports = router;
