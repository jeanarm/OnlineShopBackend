const express = require('express');
const  router = express.Router();

const { verifyIsloggedIn, verifyIsAdmin } = require('../middleware/verifyAuthToken');

const {getUserOrders,getOrder,createOrder,updateOrderToPaid,updateOrdeToDelivered} = require('../controllers/orderController')

//user routes

router.use(verifyIsloggedIn)
router.get("/", getUserOrders);
router.get("/user/:id",getOrder)
router.post("/",createOrder)
router.put("/paid/:id",updateOrderToPaid)

//admin routes

router.use(verifyIsAdmin)
router.put("/delivered/:id",updateOrdeToDelivered)

module.exports = router