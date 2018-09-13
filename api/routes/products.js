const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer"); //for image uploads

//MW
const checkAuth = require("../middleware/checkAuth");

//MULTER CONFIGS
//where to store images & set name of stored file
const imgStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/'); //null for errs
  },
  filename: function(req, file, cb) {
    //concat date with original name of file
    cb(null, (new Date().toISOString() + file.originalname));
  }
});
//filter image formats
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); //null for errs, true for save
  } else {
    cb(null, false); //false for save
  }
};
const upload = multer({
  storage: imgStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 3 } //3MB
});

// models imports
const Product = require("../models/Products");

router.get("/", (req, res, next) => {
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
});
//POST
router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
  console.log(req.file);

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
});

router.get("/:productId", (req, res, next) => {
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
});

router.patch("/:productId", checkAuth, (req, res, next) => {
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
});

router.delete("/:productId", checkAuth, (req, res, next) => {
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
});

module.exports = router;
