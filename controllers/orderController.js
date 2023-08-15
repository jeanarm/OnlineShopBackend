const Order = require('../models/OrderModel')

const getOrders = async (req, res, next) =>{

  try {
    const orders =  await Order.find({}).sort({name: "asc"}).orFail()
 
    res.json(orders)

  } catch (error) {
    next(error)
  }
}

module.exports = getOrders