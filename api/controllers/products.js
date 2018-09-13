const mongoose = require("mongoose");

// models imports
const Product = require("../models/Products");

//get all
exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage") //which fields to show
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          productImage: doc.productImage,
          request: {
            type: "GET",
            url: `/products/${doc._id}`
          }
        }))
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log("err", err);
      res.status(500).json({ error: err });
    });
};

exports.products_create = (req, res, next) => {

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path //from multer
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
          productImage: result.productImage,
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
};

exports.products_get_one = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
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
};

exports.products_edit = (req, res, next) => {
  const id = req.params.productId;
  //what fields to update?
  const updateOps = {}; //update options
  for (let key of Object.keys(req.body)) {
    updateOps[key] = req.body[key];
  }
  Product.findOneAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
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
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.products_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result =>
      res.status(200).json({
        message: "Successfully deleted",
        request: {
          type: "DELETE",
          url: `/products/${id}`
        }
      })
    )
    .catch(err => res.status(500).json({ error: err }));
};