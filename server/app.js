var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require('./swagger');

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var dishesRouter = require("./routes/dishes");
var menusRouter = require("./routes/menus");
var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
var orderRouter = require("./routes/order");
var apiRouter = require("./routes/api");

var app = express();

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb+srv://tomas:123@paw.somldg8.mongodb.net/paw", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static('public/images'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use("/api", apiRouter);
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/dishes", dishesRouter);
app.use("/menus", menusRouter);
app.use("/admin", adminRouter);
app.use("/users", usersRouter);
app.use("/order", orderRouter);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: '*' }
});

const restauranteSockets = {};

io.on('connection', (socket) => {
  socket.on('registerRestaurante', (restauranteId) => {
    restauranteSockets[restauranteId] = socket;
  });
});

app.set('io', io);
app.set('restauranteSockets', restauranteSockets);

module.exports = { app, http };
