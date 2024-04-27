const express = require("express");

const {
  signinController
} = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinController);

module.exports = router;
