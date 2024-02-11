const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
// const UserController = require("../controllers/user_controller.js");

const router = express.Router();

router.post("/signup", auth_controller.signup);
router.post("/signupExpert", auth_controller.signupExpert);
router.post("/loginExpert", auth_controller.loginExpert);
router.post("/login", auth_controller.login);
router.post("/emailVerification/:verifyEmailId", auth_controller.emailVerification);
router.post("/forgotPassword", auth_controller.forgotPassword);
router.post("/resetPassword/:token", auth_controller.resetPassword);

module.exports = router;
