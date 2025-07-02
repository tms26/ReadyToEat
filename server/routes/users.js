var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get(
  "/profile/security",
  authController.verifyLoginUser,
  userController.renderSecurityProfilePage
);
router.post(
  "/profile/security",
  authController.verifyLoginUser,
  userController.updatePassword
);

router.get(
  "/profile/edit",
  authController.verifyLoginUser,
  userController.renderProfilePage
);
router.post(
  "/profile/edit",
  authController.verifyLoginUser,
  upload.single("profileImage"),
  userController.updateProfile
);

router.get(
  "/profile/chart",
  authController.verifyLoginUser,
  userController.renderChartPage
);

router.post(
  "/profile/chart",
  authController.verifyLoginUser,
  userController.getMostOrderedDishes
);

router.post(
  "/profile/chart/restaurant",
  authController.verifyLoginUser,
  userController.getMostOrderedDishesByRestaurant
);

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
