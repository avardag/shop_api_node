const express = require("express");
const router = express.Router();


//MW
const checkAuth = require("../middleware/checkAuth");
const productControllers = require("../controllers/products");

//MULTER CONFIGS / for file uploads
const upload = require("../multerConfigs");

router.get("/", productControllers.products_get_all);
router.post("/", checkAuth, upload.single("productImage"), productControllers.products_create);
router.get("/:productId", productControllers.products_get_one);
router.patch("/:productId", checkAuth, productControllers.products_edit);
router.delete("/:productId", checkAuth, productControllers.products_delete);

module.exports = router;
