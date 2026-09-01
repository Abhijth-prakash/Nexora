const express = require("express");
const router = express.router;
const authController = require("../../controllers/users/authController");

router.get("/register", authController.register);


module.exports = router