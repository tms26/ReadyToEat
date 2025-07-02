const Order = require("../models/order");
const User = require("../models/user");
const Dish = require("../models/dish");
const Menu = require("../models/menu");
const mongoose = require("mongoose");

const orderController = {};

orderController.getOrderHistory = async (req, res) => {
  try {
    let populatedOrders = [];

    if (req.user.role === "restaurant") {
      populatedOrders = await Order.find({ restaurantId: req.user._id })
        .populate("customerId", "firstName lastName nif")
        .populate("dishes.dish")
        .sort({ date: 1 });
    } else if (req.user.role === "customer") {
      populatedOrders = await Order.find({ customerId: req.user._id })
        .populate("restaurantId", "restaurantName")
        .populate("dishes.dish")
        .sort({ date: 1 });
    }

    let customers = [];
    let menus = [];
    if (req.user.role === "restaurant") {
      customers = await User.find({ role: "customer" });
      menus = await Menu.find({ createdBy: req.user._id });

      const menuIds = menus.map((menu) => menu._id);
      const dishes = await Dish.find({ menu: { $in: menuIds } });

      menus.forEach((menu) => {
        menu.dishes = dishes.filter(
          (dish) => String(dish.menu) === String(menu._id)
        );
      });
    }

    res.render("order/orderHistory", {
      orders: populatedOrders || [],
      user: req.user,
      customers,
      menus,
    });
  } catch (error) {
    console.error("Error fetching order history:", error.stack);
    res.status(500).send("Error fetching order history: " + error.message);
  }
};

orderController.renderOrderPage = async (req, res) => {
  try {
    if (!req.user) {
      console.error("User is not authenticated");
      return res.redirect("/login");
    }

    const query =
      req.user.role === "restaurant"
        ? { restaurantId: req.user._id }
        : { customerId: req.user._id };

    const orders = await Order.find(query);

    res.render("order/orderHistory", { orders, user: req.user });
  } catch (error) {
    console.error("Error fetching order history:", error.stack);
    res.status(500).send("Error fetching order history: " + error.message);
  }
};

orderController.createPhoneOrder = async (req, res) => {
  try {
    const { customerId, selectedDishes } = req.body;

    const dishIds = Array.isArray(selectedDishes)
      ? selectedDishes
      : selectedDishes
      ? [selectedDishes]
      : [];

    const dishesArray = dishIds.map((id) => ({
      dish: id,
      quantity: 1,
    }));

    if (dishIds.length === 0) {
      return res.status(400).send("No dishes selected for the order.");
    }

    const dishes = await Dish.find({ _id: { $in: dishIds } });

    if (dishes.length === 0) {
      return res.status(404).send("No dishes found with the provided IDs.");
    }

    const totalAmount = dishes.reduce(
      (sum, dish) => sum + (dish.preco || 0),
      0
    );

    const order = new Order({
      restaurantId: req.user._id,
      customerId,
      date: new Date(),
      amount: totalAmount,
      status: "Pending",
      dishes: dishesArray,
    });

    await order.save();
    res.redirect("/order");
  } catch (error) {
    console.error("Error creating phone order:", error.stack);
    res.status(500).send("Error creating phone order: " + error.message);
  }
};

orderController.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status)
    return res.status(400).json({ error: "Missing data" });
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

orderController.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found." });

    const now = new Date();
    const diffMinutes = (now - order.date) / 60000;
    if (diffMinutes > 5) {
      return res.status(400).json({
        error: "You can only cancel within 5 minutes of placing the order.",
      });
    }

    if (order.status === "Preparing") {
      return res.status(400).json({
        error: "Order is already being prepared and cannot be cancelled.",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

orderController.getOrders = async (req, res) => {
  const { customerId } = req.query;
  if (!customerId) return res.status(400).json({ error: "Missing customerId" });
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ error: "Invalid customerId" });
  }

  try {
    const orders = await Order.find({
      customerId: new mongoose.Types.ObjectId(customerId),
    })
      .populate("restaurantId")
      .populate("dishes.dish");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

orderController.createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      customerId,
      amount,
      dishes,
      paymentOption,
      deliveryAddress,
    } = req.body;

    if (!restaurantId || !customerId || !amount || !dishes || !dishes.length) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    for (const d of dishes) {
      if (
        !d.dish ||
        !mongoose.Types.ObjectId.isValid(d.dish) ||
        typeof d.quantity !== "number" ||
        d.quantity < 1
      ) {
        return res.status(400).json({
          error: "Each dish must have a valid id and quantity >= 1.",
        });
      }
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const ordersToday = await Order.countDocuments({
      customerId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (ordersToday >= 5) {
      return res.status(403).json({
        error: "You have reached the daily limit of 5 orders.",
      });
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const cancelledOrders = await Order.find({
      customerId,
      status: "Cancelled",
      date: { $gte: oneMonthAgo },
    }).sort({ date: 1 });

    if (cancelledOrders.length >= 5) {
      const fifthCancelDate = cancelledOrders[4].date;
      const blockedUntil = new Date(fifthCancelDate);
      blockedUntil.setMonth(blockedUntil.getMonth() + 2);

      if (new Date() < blockedUntil) {
        return res.status(403).json({
          error: `You are blocked from ordering until ${blockedUntil.toLocaleDateString()}`,
        });
      }
    }

    const order = new Order({
      restaurantId,
      customerId,
      amount,
      dishes,
      paymentOption,
      deliveryAddress,
    });

    await order.save();

    const io = req.app.get('io');
    const restauranteSockets = req.app.get('restauranteSockets');
    const restauranteIdStr = String(restaurantId);
    if (restauranteSockets && restauranteSockets[restauranteIdStr]) {
      restauranteSockets[restauranteIdStr].emit('nova-encomenda', {
        message: 'New order received!',
        orderId: order._id
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

orderController.addReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    await Order.findByIdAndUpdate(req.params.orderId, {
      $push: { reviews: { comment, image, date: new Date() } },
    });
    res.status(200).json({ message: "Review saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = orderController;
