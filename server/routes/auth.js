var express = require('express');
var router = express.Router();
var authController = require("../controllers/authController");
var multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/register", authController.createLogin);

router.post("/register", upload.single('image'), authController.createLoginSubmitted);

router.get("/login", authController.login);

router.post("/login", authController.submittedLogin);

router.get("/logout", authController.logout);

module.exports = router;