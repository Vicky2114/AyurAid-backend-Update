const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
// const UserController = require("../controllers/user_controller.js");

const router = express.Router();

router.post("/signup", auth_controller.signup);
router.post("/login", auth_controller.login);
router.post("/forgotPassword", auth_controller.forgotPassword);
router.post("/resetPassword/:token", auth_controller.resetPassword);

router.use(auth_controller.protect);

// router.get("/verify/:id", UserController.verify);
// router.post("/request_reset_password", UserController.requestResetPassword);
// router.post("/reset_password", UserController.resetPassword);
module.exports = router;
