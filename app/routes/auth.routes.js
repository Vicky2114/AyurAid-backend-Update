// const { verifySignUp } = require("../middlewares");
// const controller = require("../controllers/auth.controller.js");

// console.log("verifySignUp:", verifySignUp);
// console.log("controller:", controller);

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
//     next();
//   });

//   app.post(
//     "/api/auth/signup",
//     [
//       verifySignUp.checkDuplicateUsernameOrEmail,
//       verifySignUp.checkRolesExisted
//     ],
//     controller.signup
//   );

//   app.post("/api/auth/signin", controller.signin);

//   app.post("/api/auth/signout", controller.signout);
// };

// const { verifySignUp } = require("../middlewares");
// const controller = require("../controllers/auth.controller");
// const express = require('express');
// const router = express.Router();

// router.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
//   next();
// });

// router.post(
//   "/api/auth/signup",
//   [
//     verifySignUp.checkDuplicateUsernameOrEmail,
//     verifySignUp.checkRolesExisted
//   ],
//   controller.signup
// );

// router.post("/api/auth/signin", controller.signin);

// router.post("/api/auth/signout", controller.signout);

// module.exports = router;

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
