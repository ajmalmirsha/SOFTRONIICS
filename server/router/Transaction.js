const express = require("express");
const { deposit, withdraw, getDetails } = require("../Controllers/Transaction");

const router = express.Router();

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.get("/details", getDetails);

module.exports = router;
