const mongoose = require("mongoose");
const Order = require("../models/Orders");
const Product = require("../models/Products");


exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("_id product quantity") //which fields to display?
    .populate("product", "_id name price") // show more info on product field
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => ({
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: `/orders/`
          }
        }))
      });
    })
    .catch(err => {
      console.log("err", err);
      res.status(500).json({ error: err });
    });
}

exports.order_create = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });
      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Successfully created an order",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "POST",
          url: `/orders`
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.order_get_one = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product", "_id name price") // show more info on product field
    .exec()
    .then(order => {
      res.status(200).json({
        order: {
          _id: order._id,
          product: order.product,
          quantity: order.quantity
        },
        request: {
          type: "GET",
          url: `/orders/${order._id}`
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: { message: "Order not found" } });
    });
};

exports.order_edit = (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).json({
    message: `updated order ${id}`
  });
};

exports.order_delete = (req, res, next) => {
  Order.remove({_id: req.params.orderId})
    .exec()
    .then(result=>{
      res.status(200).json({
      message: `Successfully deleted order`,
      request: {
        type: "DELETE",
        url: `/orders/${result._id}`
      }
    });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  
};

