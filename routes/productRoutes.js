const express = require('express');
const  router = express.Router();

const {getProducts,getProductById,getBestSellers,adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct,adminUpload,adminDeleteProductImage} = require("../controllers/productController")

const {verifyIsloggedIn, verifyIsAdmin}=require("../middleware/verifyAuthToken")
router.get("/category/:categoryName/search/:searchQuery",getProducts)
router.get("/category/:categoryName",getProducts)
router.get("/search/:searchQuery",getProducts)
router.get("/bestsellers",getBestSellers)
router.get("/get-one/:id",getProductById)
router.get("/", getProducts)

//admin routes:
router.use(verifyIsloggedIn)
router.use(verifyIsAdmin)
router.get("/admin",adminGetProducts)
router.delete("/admin/:id",adminDeleteProduct)
router.delete("/admin/image/:imagePath/:productId",adminDeleteProductImage)
router.post("/admin/upload",adminUpload)
router.post("/admin",adminCreateProduct)
router.put("/admin/:id",adminUpdateProduct)

module.exports = router