const express = require("express");
const router = express.Router();
const { handleBfhl } = require("../controllers/bfhlController");

// POST /bfhl -> handled by the controller
router.post("/", handleBfhl);

module.exports = router;