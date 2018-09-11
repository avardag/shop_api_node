const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// models imports
const Product = require("../models/Products");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id") //which fields to show
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc=>({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: "GET",
            url: `/products/${doc._id}`
          }
        }))
      }
      res.status(200).json(response);
    })
    .catch(err => {
      console.log("err", err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: "Successfully created product",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: `/products/${result._id}`
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: `/products/${doc._id}`
          }
        });
      } else {
        res.status(404).json({ message: "No entry for provided id" });
      }
    })
    .catch(err => {
      //catch all other errs i.e wrong _id format
      console.log("err", err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  //what fields to update?
  const updateOps = {};//update options
  for (let key of Object.keys(req.body)) {
    updateOps[key] = req.body[key];
  }
  Product.findOneAndUpdate({ _id: id }, { $set: updateOps }, {new:true})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Successfully updated",
        updatedProduct: {
          _id: result._id,
          name: result.name,
          price: result.price
        },
        request: {
          type: "PATCH",
          url: `/products/${result._id}`
        }
      })
    })
    .catch(err => res.status(500).json({ error: err }));
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => res.status(200).json({
      message: "Successfully deleted",
      request: {
        type: "DELETE",
        url: `/products/${id}`
      }
    }))
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
