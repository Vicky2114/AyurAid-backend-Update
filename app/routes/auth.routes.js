<<<<<<< HEAD
=======


>>>>>>> d41674779addbaa7176564f7a2b003b537f40bb3
const express = require("express");
const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/api/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.signup
);

router.post("/api/auth/signin", controller.signin);

module.exports.router = router;
