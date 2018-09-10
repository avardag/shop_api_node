const express = require('express');
const router = express.Router();

router.get("/", (req, res, next)=>{
  res.status(200).json({
    message: "handling GET requests in /orders"
  })
})

router.post("/", (req, res, next)=>{
  res.status(201).json({
    message: "handling POST requests in /orders"
  })
})

router.get("/:orderId", (req, res, next)=>{
  const id = req.params.orderId;
  res.status(200).json({
    message: `handling GET requests in /orders/${id}`
  })
})
router.patch("/:orderId", (req, res, next)=>{
  const id = req.params.orderId;
  res.status(200).json({
    message: `updated order ${id}`
  })
})
router.delete("/:orderId", (req, res, next)=>{
  const id = req.params.orderId;
  res.status(200).json({
    message: `deleted a order`
  })
})

module.exports = router;
