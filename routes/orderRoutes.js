const express = require('express');
const  router = express.Router();

const { verifyIsloggedIn, verifyIsAdmin } = require('../middleware/verifyAuthToken');

const {getUserOrders,getOrder,createOrder,updateOrderToPaid} = require('../controllers/orderController')

//user routes

router.use(verifyIsloggedIn)
router.get("/", getUserOrders);
router.get("/user/:id",getOrder)
router.post("/",createOrder)
router.put("/paid/:id",updateOrderToPaid)

//admin routes

router.use(verifyIsAdmin)

module.exports = router