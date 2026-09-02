const express = require("express");
const router = express.Router();
const authController = require("../../controllers/users/authController");

router.post("/register", authController.register);


module.exports = router