var express = require("express");
var router = express.Router();
var google = require("../util/google.js");
var controller = require("../controllers/auth.js");

router.get("/", controller.LoginPage);
router.post(
  "/confirm",
  google.checkJwt,
  google.Validate,
  controller.addUser,
  controller.sendKey
);
router.get("/confirm", google.checkJwt, google.Validate, controller.sendKey);

router.get("/users", controller.getUsers);

//export this router to use in our index.js
module.exports = router;
