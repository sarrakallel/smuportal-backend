var cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const router = require("./routes/createRouter.js")();

const app = express();

dotenv.config();

mongoose.connect(
  process.env.DB_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connection to DB established!")
);

// Fills DB
require("./models/populate");

//Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
//Route Middlewares
app.use("/api/user", router);

// Temporary error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

module.exports = app;
