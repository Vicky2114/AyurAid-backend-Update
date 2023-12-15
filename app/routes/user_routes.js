const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
const UserController = require("../controllers/user_controller.js");

const router = express.Router();

router.use(auth_controller.protect);

router.get("/user", UserController.detailsOfLogenIn);
router.get("/user/:id", UserController.detailsById);
router.patch("/update", UserController.updateUser);

module.exports = router;
