const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const Order = require("../models/order");
const Menu = require("../models/menu");
const Dish = require("../models/dish");
const adminController = {};

adminController.getAdminDashboard = async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" });
    res.render("admin/adminDashboard", { restaurants });
  } catch (err) {
    console.error("Error searching for restaurants:", err);
    res.status(500).send("Error loading page.");
  }
};

adminController.getRestaurantManagement = async (req, res) => {
  try {
    const restaurants = await User.find({ role: "restaurant" });
    res.render("admin/adminRestaurantManagement", { restaurants });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).send("Error loading restaurant management page.");
  }
};

adminController.getPendingRestaurants = async (req, res) => {
  try {
    const pendingRestaurants = await User.find({
      role: "restaurant",
      status: "in validation",
    });
    res.render("admin/pendingRequests", { pendingRestaurants });
  } catch (err) {
    console.error("All restaurants are valid:", err);
    res.status(500).send("Error loading page.");
  }
};

adminController.validateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.body.restaurantId;
    if (!restaurantId) {
      return res.status(400).send("Restaurant ID is required.");
    }

    await User.findByIdAndUpdate(restaurantId, { status: "valid" });
    res.redirect("/admin/pending");
  } catch (err) {
    console.error("Error validating restaurant:", err);
    res.status(500).send("Failed to validate restaurant.");
  }
};

adminController.deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const menus = await Menu.find({ createdBy: restaurantId });

    for (const menu of menus) {
      const dishes = await Dish.find({ menu: menu._id });
      for (const dish of dishes) {
        if (dish.imagem) {
          const imagePath = path.join(
            __dirname,
            "..",
            "public",
            dish.imagem.replace(/^\//, "")
          );
          try {
            await fs.promises.unlink(imagePath);
            console.log("Dish image deleted successfully:", imagePath);
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.error("Error deleting dish image:", err);
            }
          }
        }
      }
      await Dish.deleteMany({ menu: menu._id });

      if (menu.image) {
        const menuImagePath = path.join(
          __dirname,
          "..",
          "public",
          menu.image.replace(/^\//, "")
        );
        try {
          await fs.promises.unlink(menuImagePath);
          console.log("Menu image deleted successfully:", menuImagePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error("Error deleting menu image:", err);
          }
        }
      }
    }
    await Menu.deleteMany({ createdBy: restaurantId });

    const restaurant = await User.findById(restaurantId);
    if (restaurant && restaurant.image) {
      const restaurantImagePath = path.join(
        __dirname,
        "..",
        "public",
        restaurant.image.replace(/^\//, "")
      );
      try {
        await fs.promises.unlink(restaurantImagePath);
        console.log(
          "Restaurant image deleted successfully:",
          restaurantImagePath
        );
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Error deleting restaurant image:", err);
        }
      }
    }
    await User.findByIdAndDelete(restaurantId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).send("Failed to delete restaurant.");
  }
};

adminController.getEditRestaurant = async (req, res) => {
  const restaurantId = req.query.restaurantId || req.cookies.restaurantId;

  if (req.query.restaurantId) {
    res.cookie("restaurantId", req.query.restaurantId, {
      httpOnly: true,
      secure: false,
    });
    return res.redirect("/admin/restaurants/restaurant/edit");
  }

  if (!restaurantId) {
    return res.status(400).send("Restaurant ID is required.");
  }

  try {
    const restaurant = await User.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found.");
    }

    res.render("admin/editRestaurant", { restaurant });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).send("Error fetching restaurant.");
  }
};

adminController.postEditRestaurant = async (req, res) => {
  const restaurantId = req.cookies.restaurantId || req.body.restaurantId;

  if (!restaurantId) {
    return res.status(400).send("Restaurant ID is required.");
  }

  try {
    const updateData = {
      restaurantName: req.body.restaurantName,
      address: req.body.address,
      nif: req.body.nif,
      phone: req.body.phone,
      pricePerPerson: req.body.pricePerPerson,
      deliveryDistance: req.body.deliveryDistance,
    };

    if (req.file) {
      const restaurant = await User.findById(restaurantId);
      if (restaurant && restaurant.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          restaurant.image.replace(/^\//, "")
        );
        try {
          await fs.promises.unlink(oldImagePath);
          console.log("Old restaurant image deleted:", oldImagePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error("Error deleting old restaurant image:", err);
          }
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    await User.findByIdAndUpdate(restaurantId, updateData);

    res.redirect("/admin");
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).send("Error updating restaurant.");
  }
};

adminController.getAddNewRestaurant = (req, res) => {
  res.render("admin/addNewRestaurant");
};

adminController.postAddNewRestaurant = async (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const {
      firstName,
      lastName,
      email,
      nif,
      password,
      restaurantName,
      address,
      phone,
      deliveryDistance,
      pricePerPerson,
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      if (req.file) {
        fs.unlinkSync(
          path.join(__dirname, "..", "public", "uploads", req.file.filename)
        );
      }
      return res.render("admin/addNewRestaurant", {
        error: "Email already exists.",
        formData: req.body,
      });
    }
    
    const nifExists = await User.findOne({ nif });
    if (nifExists) {
      if (req.file) {
        fs.unlinkSync(
          path.join(__dirname, "..", "public", "uploads", req.file.filename)
        );
      }
      return res.render("admin/addNewRestaurant", {
        error: "NIF already exists.",
        formData: req.body,
      });
    }
    
    const nameExists = await User.findOne({ restaurantName });
    if (nameExists) {
      if (req.file) {
        fs.unlinkSync(
          path.join(__dirname, "..", "public", "uploads", req.file.filename)
        );
      }
      return res.render("admin/addNewRestaurant", {
        error: "Restaurant name already exists.",
        formData: req.body,
      });
    }

    const newRestaurant = new User({
      firstName,
      lastName,
      email,
      nif,
      password,
      role: "restaurant",
      restaurantName,
      address,
      phone,
      deliveryDistance,
      pricePerPerson,
      image,
    });

    await newRestaurant.save();
    res.redirect("/admin");
  } catch (err) {
    console.error("Error creating new restaurant:", err);
    res.render("admin/addNewRestaurant", {
      error: "Failed to create new restaurant.",
      formData: req.body,
    });
  }
};

adminController.getAnalytics = async (req, res) => {
  try {
    const topRestaurants = await User.aggregate([
      { $match: { role: "restaurant" } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "restaurantId",
          as: "orders",
        },
      },
      {
        $project: {
          name: "$restaurantName",
          orders: { $size: "$orders" },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 5 },
    ]);

    const revenueByRestaurant = await User.aggregate([
      { $match: { role: "restaurant" } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "restaurantId",
          as: "orders",
        },
      },
      {
        $project: {
          name: "$restaurantName",
          revenue: { $sum: "$orders.amount" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({ topRestaurants, revenueByRestaurant });
  } catch (err) {
    console.error("Error fetching analytics data:", err);
    res.status(500).send("Failed to load analytics data.");
  }
};

adminController.getAnalytics2 = async (req, res) => {
  try {
    const ordersByDate = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = ordersByDate.map((order) => order._id);
    const orders = ordersByDate.map((order) => order.count);

    res.json({ labels, orders });
  } catch (err) {
    console.error("Error fetching analytics 2 data:", err);
    res.status(500).send("Failed to load analytics 2 data.");
  }
};

module.exports = adminController;
