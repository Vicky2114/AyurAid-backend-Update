const express = require("express");
const { verifySignUp } = require("../middlewares");
// const controller = require("../controllers/auth.controller");
const UserController = require("../controllers/user_controller.js");
const router = express.Router();

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  UserController.signup
);

router.post("/login", UserController.login);
router.get("/verify/:id", UserController.verify);
module.exports = router;
