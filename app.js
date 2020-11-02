var cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const router = require("./routes/createRouter.js")();

const app = express();

dotenv.config();

// Connect to DB
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
mongoose.connect(process.env.DB_URL, options);

mongoose.connection.on('connected', function () {
  console.log('Database connection established!');
}); 

mongoose.connection.on('error',function (err) { 
  console.log('Database connection connection error: ' + err);
}); 

mongoose.connection.on('disconnected', function () { 
  console.log('Database disconnected'); 
});

// Safe exit on Node process crash
process.on('SIGINT', function() {   
  mongoose.connection.close(function () { 
    console.log('App terminated... Database connection closed.'); 
    process.exit(0); 
  }); 
}); 

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
