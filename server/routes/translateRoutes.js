const { translateController } = require("../controllers/translateController");

const router = require("express").Router();

router.post("/", translateController);

module.exports = router;