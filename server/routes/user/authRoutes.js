const express = require("express");
const router = express.Router();
const authController = require("../../controllers/users/authController");
const passport= require('passport')
const {authenticate} = require('../../middilewares/auth')
const config = require('../../config/config')

router.post("/register", authController.register);
router.post("/verify", authController.Verify);
router.get("/google",passport.authenticate("google", {scope: ["profile", "email"],}),);
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect(
        `${config.FRONTEND_URL}/auth/login?error=${encodeURIComponent(
          info?.message || "Google authentication failed"
        )}`
      );
    }

    req.user = user;
    next();
  })(req, res, next);
}, authController.googleCallback);
router.post("/login",authController.login)
router.get("/logout",authController.logout)
router.post("/forgetpassword",authController.forgetpassword)
router.post('/resetpassword',authController.resetPassword)
router.post('/resendOtp',authController.resendOtp)
router.post('/changePassword',authenticate,authController.changepassword)
router.post('/editProfile',authenticate,authController.editProfile)
router.get("/user",authenticate,authController.userDetails)



module.exports = router;
