const express = require("express");
const router = express.Router();
const authController = require("../../controllers/users/authController");
const passport= require('passport')
const {authenticate} = require('../../middilewares/auth')

router.post("/register", authController.register);
router.post("/verify", authController.Verify);
router.get("/google",passport.authenticate("google", {scope: ["profile", "email"],}),);
router.get("/google/callback",passport.authenticate("google", {session: false,failureRedirect: "/register",}),authController.googleCallback);
router.post("/login",authController.login)
router.get("/user",authenticate,authController.userDetails)

module.exports = router;
