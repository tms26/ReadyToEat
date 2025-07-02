const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const menuController = require("../controllers/menuController");
const dishController = require("../controllers/dishController");
const orderController = require("../controllers/orderController");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   - name: Api
 *     description: API routes for the angular food delivery application.
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Retrieve all valid restaurants
 *     tags: [Api]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized access
 */

router.get(
  "/restaurants",
  authController.verifyLoginUser,
  userController.getRestaurants
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}:
 *   get:
 *     summary: Retrieve details of a specific restaurant by ID
 *     tags: [Api]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the restaurant
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Restaurant not found
 */
router.get(
  "/restaurants/:restaurantId",
  authController.verifyLoginUser,
  userController.getRestaurantesById
);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/menus:
 *   get:
 *     summary: Retrieve all menus for a specific restaurant
 *     tags: [Api]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the restaurant
 *     responses:
 *       200:
 *         description: A list of menus for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Menus not found
 */
router.get(
  "/restaurants/:restaurantId/menus",
  authController.verifyLoginUser,
  userController.getMenusByRestaurantId
);

/**
 * @swagger
 * /api/register:
 *   get:
 *     summary: Show registration form
 *     tags: [Api]
 *   post:
 *     summary: Register a new user
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */

router.get("/register", authController.createLogin);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */
router.post(
  "/register",
  upload.single("image"),
  authController.createLoginSubmitted
);

/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Show login form
 *     tags: [Api]
 *   post:
 *     summary: Login a user
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.get("/login", authController.login);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post("/login", authController.submittedLogin);

/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Api]
 */
router.get("/logout", authController.logout);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Api]
 *   put:
 *     summary: Update user profile
 *     tags: [Api]
 * 
 */
router.get(
  "/profile",
  authController.verifyLoginUser,
  userController.getProfile
);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */
router.put(
  "/profile",
  authController.verifyLoginUser,
  userController.updateProfileRest
);

/**
 * @swagger
 * /api/profile/password:
 *   put:
 *     summary: Change user password
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 */
router.put(
  "/profile/password",
  authController.verifyLoginUser,
  userController.changePassword
);

/**
 * @swagger
 * /api/profile/charts:
 *   get:
 *     summary: Get most ordered dishes by the logged-in user
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of most ordered dishes by the user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/profile/charts",
  authController.verifyLoginUser,
  userController.getMostOrderedDishesByUser
);


/**
 * @swagger
 * /api/profile/globalCharts:
 *   get:
 *     summary: Get most ordered dishes globally
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of most ordered dishes globally
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/profile/globalCharts",
  authController.verifyLoginUser,
  userController.getMostOrderedDishes
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for a customer
 *     tags: [Api]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: List of orders
 *       400:
 *         description: Missing or invalid customerId
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new order
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               amount:
 *                 type: number
 *               dishes:
 *                 type: array
 *                 items:
 *                   type: string
 *               paymentOption:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.get("/orders", orderController.getOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               amount:
 *                 type: number
 *               dishes:
 *                 type: array
 *                 items:
 *                   type: string
 *               paymentOption:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 */
router.post("/orders", orderController.createOrder);

/**
 * @swagger
 * /api/orders/{orderId}/review:
 *   post:
 *     summary: Add a review to an order
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Review saved
 *       500:
 *         description: Internal server error
 */
router.post(
  "/orders/:orderId/review",
  upload.single("image"),
  orderController.addReview
);

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled
 *       500:
 *         description: Internal server error
 */
router.post("/orders/:orderId/cancel", orderController.cancelOrder);

/**
 * @swagger
 * /api/{menuId}:
 *   get:
 *     summary: Get menu by ID
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
 *     responses:
 *       200:
 *         description: Menu found
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Internal server error
 */
router.get("/:menuId", menuController.getMenuById);

/**
 * @swagger
 * /api/{menuId}/dishes:
 *   get:
 *     summary: Get dishes by menu ID
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
 *     responses:
 *       200:
 *         description: List of dishes for the menu
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:menuId/dishes",
  authController.verifyLoginUser,
  menuController.getDishesByMenuId
);

/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Get all dishes
 *     tags: [Api]
 *     responses:
 *       200:
 *         description: List of dishes
 *       500:
 *         description: Internal server error
 */
router.get("/dishes", dishController.list);

/**
 * @swagger
 * /api/dishes/{dishId}:
 *   get:
 *     summary: Get dish by ID
 *     tags: [Api]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish found
 *       404:
 *         description: Dish not found
 *       500:
 *         description: Internal server error
 */
router.get("/dishes/:dishId", dishController.getDishById);

module.exports = router;
