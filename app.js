require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
//Route imports
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

//MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
mongoose.set({"debug":true})


app.use(morgan('dev'));
app.use("/uploads", express.static("uploads")) // make images folder available for everyone
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//CORS handler
app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*"); //allow acces from anywhere
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({})
  }
  next()
})

// ROUTES
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

// catch allroute / Error Handling
app.use((req, res, next)=>{
  const error = new Error('Not Found!!!'); //send err msg / set err.message
  error.status = 404; // send err status
  next(error); // go to next with error as arg
})
//repond with error messages
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.json({
    error:{
      message: err.message
    }
  })
})

module.exports = app;
