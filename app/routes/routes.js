const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user_controller.js");

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/verify/:id", UserController.verify);
router.post("/request_reset_password", UserController.requestResetPassword);
router.post("/reset_password", UserController.resetPassword);
module.exports = router;
