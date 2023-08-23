const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
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

const createOrder = async(req,res,next) =>{
  
    try {
      const {cartItems,orderTotal,paymentMethod} = req.body

      if(!(cartItems || orderTotal || paymentMethod)){
        return res.status(400).send("All inputs are required")
      }
      
      let ids = cartItems.map((item)=>{
        return item.productID
      })
      let qty = cartItems.map((item)=>{
        return Number(item.quantity)
      })

      await Product.find({_id:{$in:ids}}).then((products)=>{
        products.forEach(function(product,idx) {
          product.sales += qty[idx]
          product.save()
          
        });
      })
      const order = new Order({
        user:ObjectId(req.user._id),
        orderTotal:orderTotal,
        cartItems:cartItems,
        paymentMethod:paymentMethod
      })

      const createdOrder = await order.save()

      res.status(201).send(createdOrder)



    } catch (error) {
      next(error)
    }

}

const updateOrderToPaid = async (req,res,next)=>{
try {
  
  const order = await Order.findById(req.params.id).orFail()
   order.isPaid = true
   order.payedAt = Date.now()
   
   const updatedOrder = await order.save()
   res.send(updatedOrder)

} catch (error) {
  
}

}
const updateOrdeToDelivered = async (req,res,next)=>{

  try {
    const order = await Order.findById(req.params.id).orFail();

    order.isDelivered =true
    order.deliveredAt = Date.now()

    await order.save()
    res.send(order)
    
  } catch (error) {
    next(error)
    
  }

}
const getOrders = async (req,res,next) =>{
  try {
    
    const orders = await Order.find({}).populate("user","-password").sort({paymentMethod:"desc"})

    res.send(orders)

  } catch (error) {
    next(error)
    
  }
}

module.exports = {getUserOrders,getOrder,createOrder,updateOrderToPaid,updateOrdeToDelivered,getOrders}