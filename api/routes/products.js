const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// models imports
const Product = require("../models/Products");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(products => {
      // if (products.length > 0) {
      res.status(200).json({ products });
      // } else {
      //   res.status(404).json({message: "No entries found"})
      // }
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
        message: "handling POST requests in /products",
        createdProduct: result
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
    .exec()
    .then(doc => {
      console.log("doc", doc);
      if (doc) {
        res.status(200).json(doc);
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
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err }));
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
