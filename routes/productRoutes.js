const express = require('express');
const  router = express.Router();

const {getProducts,getProductById,getBestSellers} = require("../controllers/productController")
router.get("/category/:categoryName/search/:searchQuery",getProducts)
router.get("/category/:categoryName",getProducts)
router.get("/search/:searchQuery",getProducts)
router.get("/bestsellers",getBestSellers)
router.get("/:id",getProductById)
router.get("/", getProducts)
module.exports = router