const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

router.post('/phone', authController.verifyLoginUser, orderController.createPhoneOrder);
router.get('/', authController.verifyLoginUser, orderController.getOrderHistory);
router.post('/update-status', authController.verifyLoginUser, orderController.updateOrderStatus);


module.exports = router;