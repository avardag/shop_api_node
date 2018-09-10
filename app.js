const express = require("express");
const morgan = require("morgan");
const app = express();

//Route imports
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

app.use(morgan('dev'));


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
