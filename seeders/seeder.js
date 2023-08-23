const connectDB = require("../config/db");

connectDB()

const categoryData = require("./categories");
const productData = require("./products");
const  reviewsdata= require("./reviews");
const userData = require("./users");
const ordersData = require("./orders"); 

const Category = require ("../models/CategoryModel")
const Product = require ("../models/ProductModel")
const Review = require ("../models/ReviewModel")
const Order = require ("../models/OrderModel")
const User = require("../models/UserModel")


const importData = async() =>{

    try {
        await Category.collection.dropIndexes()
        await Product.collection.dropIndexes()
        await Review.collection.dropIndexes()
        await Order.collection.dropIndexes()
        await User.collection.dropIndexes()
  
        await Category.deleteMany({})
        await Product.deleteMany({})
        await Review.deleteMany({})
        await Order.deleteMany({})
        await User.deleteMany({})

        if(process.argv[2] !== "-d"){
            await Category.insertMany(categoryData)
            await Order.insertMany(ordersData)
            await User.insertMany(userData)
            const reviews = await Review.insertMany(reviewsdata)
            const sampleProducts = productData.map((product)=>{
    
                reviews.map((review)=>{
                    product.reviews.push(review._id)
                })
                return {...product}
            })
            await Product.insertMany(sampleProducts)
            console.log("Seeder Data imported successfully")
            process.exit()

        }
      console.log("Seeder data deleted sucessfully")
      process.exit()
       
        
    } catch (error) {
        console.log("Error saving  data", error)
        
    }

    
}

importData()