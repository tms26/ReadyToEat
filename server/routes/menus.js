const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const menuController = require("../controllers/menuController");
const authController = require("../controllers/authController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


router.get('/', authController.verifyLoginUser, menuController.getAllMenus);

router.get('/new', authController.verifyLoginUser, menuController.renderNewMenuForm);
router.post('/new', authController.verifyLoginUser, upload.single('image'), menuController.createMenu);

router.get("/dishes", authController.verifyLoginUser ,menuController.getMenuDishes);

router.get("/edit", authController.verifyLoginUser, menuController.renderEditMenuForm);
router.post("/edit", authController.verifyLoginUser, upload.single("image"), menuController.updateMenu);

router.delete("/:id", authController.verifyLoginUser, menuController.deleteMenu);



module.exports = router;