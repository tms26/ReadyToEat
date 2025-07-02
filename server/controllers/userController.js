const mongoose = require("mongoose");
const User = require("../models/user");
const Order = require("../models/order");
const Dish = require("../models/dish");
const bcrypt = require("bcrypt");
const Menu = require("../models/menu");

var userController = {};

userController.show = function (req, res) {
  User.findOne({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error retrieving user:", err);
    } else {
      res.render("../views/user/show", { user: user });
    }
  });
};

userController.edit = function (req, res) {
  User.findOne({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error retrieving user:", err);
    } else {
      res.render("../views/user/edit", { user: user });
    }
  });
};

userController.update = function (req, res) {
  User.findOne({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error retrieving user:", err);
    } else {
      user.name = req.body.name;
      user.email = req.body.email;
      user.nif = req.body.nif;
      user.password = req.body.password;

      user.save(function (err) {
        if (err) {
          console.log("Error saving user:", err);
        } else {
          res.redirect("/users/" + user._id);
        }
      });
    }
  });
};

userController.delete = function (req, res) {
  User.findOneAndDelete({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      console.log("Error deleting user:", err);
    } else {
      res.redirect("/users");
    }
  });
};

userController.renderProfilePage = (req, res) => {
  res.render("user/profile", { user: req.user });
};

userController.renderSecurityProfilePage = (req, res) => {
  res.render("user/security", { user: req.user });
};

userController.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.render("user/security", {
        user: req.user,
        errorMessage: "New password and confirmation do not match.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.render("user/security", {
        user: req.user,
        errorMessage: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.render("user/security", {
        user: req.user,
        errorMessage: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.render("user/security", {
      user: req.user,
      successMessage: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.render("user/security", {
      user: req.user,
      errorMessage: "An error occurred while updating the password.",
    });
  }
};

userController.updateProfile = async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.firstName) updateFields.firstName = req.body.firstName;
    if (req.body.lastName) updateFields.lastName = req.body.lastName;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.nif) updateFields.nif = req.body.nif;
    if (req.body.restaurantName)
      updateFields.restaurantName = req.body.restaurantName;
    if (req.body.address) updateFields.address = req.body.address;
    if (req.body.phone) updateFields.phone = req.body.phone;
    if (req.body.pricePerPerson)
      updateFields.pricePerPerson = req.body.pricePerPerson;
    if (req.body.deliveryDistance)
      updateFields.deliveryDistance = req.body.deliveryDistance;


    if (req.file) {
      updateFields.image = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.redirect("/users/profile/edit");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log("User not found for updating.");
      return res.status(404).send("User not found.");
    }

    console.log("User profile updated successfully.");
    res.redirect("/users/profile/edit");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile.");
  }
};

userController.renderChartPage = (req, res) => {
  res.render("user/chart", { user: req.user });
};

userController.getMostOrderedDishes = async (req, res) => {
  try {
    const dishes = await Order.aggregate([
      { $unwind: "$dishes" },
      {
        $group: {
          _id: "$dishes.dish",
          count: { $sum: "$dishes.quantity" }
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const dishDetails = await Dish.find({
      _id: { $in: dishes.map((d) => d._id) },
    });

    const chartData = dishes
      .map((dish) => {
        const dishDetail = dishDetails.find((d) => d._id.equals(dish._id));
        if (dishDetail) {
          return {
            name: dishDetail.nome,
            count: dish.count,
          };
        }
        return null;
      })
      .filter((dish) => dish !== null);

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching most ordered dishes:", error);
    res.status(500).send("Failed to load chart data.");
  }
};

userController.getMostOrderedDishesByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const dishes = await Order.aggregate([
      { $match: { customerId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$dishes" },
      {
        $group: {
          _id: "$dishes.dish",
          count: { $sum: "$dishes.quantity" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const dishDetails = await Dish.find({
      _id: { $in: dishes.map((d) => d._id) },
    });

    const chartData = dishes
      .map((dish) => {
        const dishDetail = dishDetails.find((d) => d._id.equals(dish._id));
        if (dishDetail) {
          return {
            name: dishDetail.nome,
            count: dish.count,
          };
        }
        return null;
      })
      .filter((dish) => dish !== null);

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching most ordered dishes:", error);
    res.status(500).send("Failed to load chart data.");
  }
};

userController.getMostOrderedDishesByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.user._id;

    const dishes = await Order.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      { $unwind: "$dishes" },
      {
        $group: {
          _id: "$dishes.dish",
          count: { $sum: "$dishes.quantity" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const dishDetails = await Dish.find({
      _id: { $in: dishes.map((d) => d._id) },
    });

    const chartData = dishes
      .map((dish) => {
        const dishDetail = dishDetails.find((d) => d._id.equals(dish._id));
        if (dishDetail) {
          return {
            name: dishDetail.nome,
            count: dish.count,
          };
        }
        return null;
      })
      .filter((dish) => dish !== null);

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching most ordered dishes by restaurant:", error);
    res.status(500).send("Failed to load chart data.");
  }
};

userController.getRestaurants = async (req, res) => {
  try {
    const restaurants = await User.find({
      role: "restaurant",
      status: "valid"
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

userController.getRestaurantesById = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await User.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found.");
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).send("Failed to load restaurant.");
  }
};

userController.getMenusByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menus = await Menu.find({ createdBy: restaurantId });
    if (!menus) {
      return res.status(404).send("Menus not found.");
    }
 
    res.json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).send("Failed to load menus.");
  }
};

userController.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "firstName lastName email nif"
    );
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile." });
  }
};

userController.updateProfileRest = async (req, res) => {
  try {
    const { firstName, lastName, email, nif } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email, nif },
      { new: true, runValidators: true }
    ).select("firstName lastName email nif");
    if (!updatedUser) return res.status(404).json({ error: "User not found." });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating profile." });
  }
};

userController.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirmation do not match." });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found." });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error updating password." });
  }
};

module.exports = userController;
