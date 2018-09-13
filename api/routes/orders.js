const express = require("express");
const router = express.Router();

// MW
const checkAuth = require("../middleware/checkAuth");

// Route controllers
const ordersController = require("../controllers/orders")

router.get("/", checkAuth, ordersController.orders_get_all);
router.post("/", checkAuth, ordersController.order_create);
router.get("/:orderId", checkAuth, ordersController.order_get_one);
router.patch("/:orderId", checkAuth, ordersController.order_edit);
router.delete("/:orderId", checkAuth, ordersController.order_delete);

module.exports = router;
