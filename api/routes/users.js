const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

//Routes
//SIGNUP
router.post("/signup", (req, res, next) => {
  //check if a user with passed email already exists
  User.find({email: req.body.email})
    .exec()
    .then(user=>{ //returns array
      if (user.length>0) {
        return res.status(409).json({message: "User already exists"})
      } else {
        //first hash a passowrd w/ bcrypt
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            //if no err , create a new user , using hashed password
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result=>{
                console.log('result', result);
                res.status(200).json({
                  message: "Successfully created a user",
                })
              })
              .catch(err=>{
                console.log('err', err);
                res.status(500).json({error: err})
              });
          }
        });
      }
    })
});

//LOGIN
router.post("/login", (req, res, next)=>{
  User.findOne({email: req.body.email})
    .exec()
    .then(user=>{
      if (!user) {
        return res.status(401).json({message: "Auth failed"})
      }
      bcrypt.compare(req.body.password, user.password, (err, match)=>{
        if (err) {
          return res.status(401).json({message: "Auth failed"})
        }else if (match) { //if passwords match
          return res.status(200).json({message: "Successfuly loginned"})
        }else{ // passwords dont match || any other case
          return res.status(401).json({message: "Auth failed"})
        }
      })
    })
    .catch(err=>{
      console.log('err', err);
      res.status(500).json({error: err})
    });
})

//DELETE
router.delete("/:userId", (req, res, next)=>{
  User.remove({_id: req.params.userId})
    .exec()
    .then(result=>{
      res.status(200).json({
        message: "Successfully deleted a user"
      })
    })
    .catch(err=>{
      res.status(500).json({error: err})
    });
})

module.exports = router;
