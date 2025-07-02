const Dish = require("../models/dish");
const Category = require("../models/category");
const Menu = require("../models/menu");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

var dishController = {};

dishController.list = async function (req, res) {
  const { menuId, sort, category } = req.query;

  try {
    const menu = await Menu.findById(menuId);

    let query = { menu: menuId };
    if (category) {
      query.categoria = category;
    }

    let dishes = Dish.find(query);

    if (sort === "price_asc") {
      dishes = dishes.sort({ preco: 1 });
    } else if (sort === "price_desc") {
      dishes = dishes.sort({ preco: -1 });
    }

    dishes = await dishes;

    res.json({ pratos: dishes, menu });
  } catch (err) {
    console.error("Error listing dishes:", err);
    res.status(500).send("Error listing dishes.");
  }
};

dishController.addForm = async function (req, res) {
  try {
    const menuId = req.cookies.menuId || req.query.menuId;
    
    const categories = await Category.find();
    res.render("menu/add", {
      menuId,
      dish: null,
      categories,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error fetching categories.");
  }
};

dishController.save = async function (req, res) {
  try {
    const menuId = req.body.menuId;

    const dishCount = await Dish.countDocuments({ menu: menuId });
    if (dishCount >= 10) {
      const categories = await Category.find(); 
      return res.status(400).render("menu/add", {
        menuId: menuId,
        dish: req.body,
        categories: categories,
        error: "This menu already has the maximum of 10 dishes."
      });
    }

    let category;
    if (req.body.category === "new") {
      category = await Category.findOneAndUpdate(
        { name: req.body.newCategory },
        { name: req.body.newCategory },
        { upsert: true, new: true }
      );
    } else {
      category = await Category.findOne({ name: req.body.category });
    }

    const dish = new Dish({
      nome: req.body.dishName,
      descricao: req.body.description,
      categoria: category.name,
      tempoPreparo: req.body.prepTime,
      preco: req.body.price,
      tamanhoPorcao: req.body.portionSize,
      informacaoNutricional: {
        calorias: req.body.calories || 0,
        proteinas: req.body.protein || 0,
        carboidratos: req.body.carbs || 0,
        gorduras: req.body.fat || 0,
        sodio: req.body.sodium || 0,
      },
      imagem: req.file ? `/uploads/${req.file.filename}` : null,
      menu: menuId,
    });

    await dish.save();
    res.redirect(`/menus/dishes?menuId=${menuId}`);
  } catch (err) {
    console.error("Error saving dish:", err);
    const categories = await Category.find(); 
    res.status(500).render("menu/add", {
      menuId: req.body.menuId,
      dish: req.body, 
      categories: categories, 
      error: "Error saving dish."
    });
  }
};

dishController.editForm = async function (req, res) {
  try {
    const dishId = req.cookies.dishId;

    if (!dishId) {
      return res.status(400).send("Dish ID is required.");
    }

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).send("Dish not found.");
    }

    const categories = await Category.find();
    res.render("menu/add", { dish, menuId: dish.menu, categories });
  } catch (err) {
    console.error("Error fetching dish for editing:", err);
    res.status(500).send("Error fetching dish.");
  }
};

dishController.update = async function (req, res) {
  try {
    const dishId = req.cookies.dishId;

    if (!dishId) {
      return res.status(400).send("Dish ID is required.");
    }

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).send("Dish not found.");
    }

    dish.nome = req.body.dishName;
    dish.descricao = req.body.description;
    dish.categoria = req.body.category;
    dish.tempoPreparo = req.body.prepTime;
    dish.preco = req.body.price;
    dish.tamanhoPorcao = req.body.portionSize;
    dish.informacaoNutricional = {
      calorias: req.body.calories || 0,
      proteinas: req.body.protein || 0,
      carboidratos: req.body.carbs || 0,
      gorduras: req.body.fat || 0,
      sodio: req.body.sodium || 0,
    };

    if (req.file) {
      dish.imagem = `/uploads/${req.file.filename}`;
    }

    await dish.save();
    res.clearCookie("dishId");
    res.redirect(`/menus/dishes?menuId=${dish.menu}`);
  } catch (err) {
    console.log("Error updating dish:", err);
    res.status(500).send("Error updating dish.");
  }
};

dishController.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { menuId } = req.query;

    const dish = await Dish.findById(id);

    if (!dish) {
      return res.status(404).json({ error: "Dish not found." });
    }

    if (dish.imagem) {
      const imagePath = path.join(__dirname, "..", "public", dish.imagem);
      try {
      fs.unlinkSync(imagePath);
      console.log("Image deleted successfully:", imagePath);
      } catch (err) {
      console.error("Error deleting image:", err);
      }
    }

    await Dish.findByIdAndDelete(id);

    return res.status(200).json({ 
      success: true, 
      message: "Dish deleted successfully!" 
    });
  } catch (error) {
    console.error("Error deleting dish:", error);
    return res.status(500).json({ error: "Error deleting dish." });
  }
};


dishController.getDishDetails = async (req, res) => {
  const dishId = req.query.dishId || req.cookies.dishId; 

  if (req.query.dishId) {
      res.cookie("dishId", req.query.dishId, { httpOnly: true, secure: false });
      return res.redirect("/dishes/dish");
  }

  if (!dishId) {
      return res.status(400).send("Dish ID is required.");
  }

  try {
      const dish = await Dish.findById(dishId); 
      if (!dish) {
          return res.status(404).send("Dish not found.");
      } 
      res.render("menu/dishInfo", { prato: dish, user: req.user });
  } catch (error) {
      console.error("Error rendering dish details:", error);
      res.status(500).send("Error rendering dish details.");
  }
};

dishController.getDishById = async (req, res) => {
  const dishId = req.params.dishId; 

  try {
    const dish = await Dish.findById(dishId) 
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(dish);
  }
  catch (error) {
    console.error("Error fetching dish:", error);
    res.status(500).json({ message: "Error fetching dish" });
  }
}

module.exports = { ...dishController, upload };
