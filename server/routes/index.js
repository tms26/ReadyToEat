const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/index", authController.verifyLoginUser, (req, res) => {
  res.render("index", { user: req.user });
});

module.exports = router;