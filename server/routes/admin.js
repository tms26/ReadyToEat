const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", authController.verifyAdmin, adminController.getAdminDashboard);

router.get("/restaurantManagement", authController.verifyLoginUser, adminController.getRestaurantManagement);

router.post('/reject/restaurant/:id', authController.verifyAdmin, adminController.deleteRestaurant);

router.delete("/restaurants/:id", authController.verifyAdmin, adminController.deleteRestaurant);

router.get("/restaurants/restaurant/edit", authController.verifyAdmin, adminController.getEditRestaurant);

router.post("/restaurants/restaurant/edit", authController.verifyAdmin, upload.single("image"), adminController.postEditRestaurant);

router.get("/addNewRestaurant", authController.verifyAdmin, adminController.getAddNewRestaurant);

router.post("/addNewRestaurant", authController.verifyAdmin, upload.single("image"), adminController.postAddNewRestaurant);

router.get("/pending", authController.verifyAdmin, adminController.getPendingRestaurants);

router.post("/validate/restaurant", authController.verifyAdmin, adminController.validateRestaurant);

router.get("/analytics", authController.verifyAdmin, adminController.getAnalytics);

router.get("/analytics2", authController.verifyAdmin, adminController.getAnalytics2);

module.exports = router;