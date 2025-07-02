var express = require("express");
var router = express.Router();
var dishController = require("../controllers/dishController");
var authController = require("../controllers/authController");
const Dish = require("../models/dish");

router.get("/", authController.verifyLoginUser, dishController.list);

router.get("/add", authController.verifyLoginUser, dishController.addForm);

router.post("/add", authController.verifyLoginUser, dishController.upload.single("image"), dishController.save);

router.get("/edit", authController.verifyLoginUser, dishController.editForm);

router.post("/edit", authController.verifyLoginUser, dishController.upload.single("image"), dishController.update);

router.delete("/:id/delete", authController.verifyLoginUser, dishController.deleteDish);

router.get("/dish", authController.verifyLoginUser, dishController.getDishDetails);

router.get("/:dishId", authController.verifyLoginUser, dishController.getDishById);

module.exports = router;
