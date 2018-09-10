const express = require('express')

const app = express();

const productsRoutes = require("./api/routes/products")
const ordersRoutes = require("./api/routes/orders")


// ROUTES
app.use("/products", productsRoutes)
app.use("/orders", ordersRoutes)

module.exports = app;