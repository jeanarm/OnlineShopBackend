const Order = require('../models/OrderModel')
const ObjectId = require("mongodb").ObjectId
const getUserOrders = async (req, res, next) =>{

  try {
    const orders =  await Order.find({user:ObjectId(req.user._id)})
 
    res.json(orders)

  } catch (error) {
    next(error)
  }
}

const getOrder = async (req,res,next) =>{

  try {
    const order = await Order.findById(req.params.id).populate("user","-password -isAdmin -_id -__v -createdAt -updatedAt").orFail()

    res.json(order)
    
  } catch (error) {
    next(error)
    
  }

}

module.exports = {getUserOrders,getOrder}