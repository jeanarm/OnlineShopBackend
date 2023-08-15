
const Product = require("../models/ProductModel")
const getProducts = async (req, res, next) => {

  try {
    
    const products = await Product.find({}).sort({name:"asc"}).orFail()
    res.json(products)
  } catch (error) {
    next(error)
    
  }

}

module.exports= getProducts;

    