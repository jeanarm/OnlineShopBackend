const express = require('express');
const  router = express.Router();

const { verifyIsloggedIn, verifyIsAdmin } = require('../middleware/verifyAuthToken');

const getUserOrders = require('../controllers/orderController')

//user routes

router.use(verifyIsloggedIn)
router.get("/", getUserOrders);


//admin routes

router.use(verifyIsAdmin)
module.exports = router