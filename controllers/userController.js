const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const generateAuthToken = require("../utils/generateAuthToken");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const Review = require("../models/ReviewModel")
const Product = require("../models/ProductModel")
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (!(name && lastName && email && password)) {
      return res.status(400).json({ message: "All inpus are required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    } else {
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        )
        .status(201)
        .json({
          Success: "User created",
          CreatedUser: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All inputs are required!!!");
    }

    const user = await User.findOne({ email });

    if (user && comparePasswords(password,user.password)) {
      let cookiesParams = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      if (doNotLogout) {
        cookiesParams = { ...cookiesParams, maxAge: 1000 * 60 * 60 * 24 * 7 };
        //
      }

      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookiesParams
        )
        .json({
          Success: "user logged in successfully",
          loggedInUser: {
            _id: user._id,
            name: user.name,
            email: user.email,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            doNotLogout,
          },
        });
    }else{
        return res.status(401).send("Wrong credentials")
    }
  } catch (error) {
    next(error);
  }
};


const updateUserProfile = async (req,res,next) =>{
     
    try {
      
      const user = await User.findById(req.user._id).orFail()
       

      user.name = req.body.name || user.name
      user.lastName = req.lastName || user.lastName
      user.email = req.body.email || user.email
      user.phoneNumber = req.body.phoneNumber
      user.address = req.body.address 
      user.country = req.body.country 
      user.zipCode = req.body.zipCode 
      user.city = req.body.city
      user.state = req.body.state
      if (req.body.password!==user.password){
        user.password = hashPassword(req.body.password)
      }
      
      await user.save()

      res.json(
        {
          Success:"user Updated ",
          UpdatedUser:{
            _id :user._id,
            name:user.name,
            lastName:user.lastName,
            email:user.email,
            isAdmin:user.isAdmin,
            phoneNumber:user.phoneNumber ,
            address:user.address,
            city:user.city,
            country:user.country
          },
        })

    } catch (error) {
      
      next(error);
    }

}

const getUserProfile =  async(req,res,next) =>{
  
try {

  const user = await User.findById(req.params.id).select("-password").orFail()
      
  return res.send(user)
  
} catch (error) {
  next(error)
  
}

}

const writeReview = async(req,res,next) =>{
  try {
  
     const {comment,rating} = req.body

     //Validate request
        
     if(!(comment && rating)){
      return res.status(400).send("All inouts are required")

     }
    
     //create review id manually because it is needed for saving collection
    
    const ObjectId = require("mongodb").ObjectId

    let reviewId = ObjectId()
    
    await Review.create(
      [
        {
          _id:reviewId,
          comment:comment,
          rating: Number(rating),
          user:{
            _id:req.user._id,name:req.user.name + " " + req.user.lastName
          },

        }
      ]
    )
    const product = await Product.findById(req.params.productId).populate("reviews");

    const alreadyReviewed = product.reviews.find((r)=>r.user._id.toString() === req.user._id.toString())

    if(alreadyReviewed){

      return res.status(400).send("You have already reviewed this product")
    }
   
    let prc = [...product.reviews]
    prc.push({rating:rating})
    product.reviews.push(reviewId)

    if(product.reviews.length === 1){
      product.rating = Number(rating);
      product.reviewsNumber =1;
    }else{
      product.reviewsNumber = product.reviews.length
      product.rating = prc.map((item)=>Number(item.rating)).reduce(
        (sum,item)=>sum+item,0)/product.reviews.length
      
    }
    await  product.save()
    res.send('Review created')


  } catch (error) {
    next(error)
    
  }
}

module.exports = { getUsers, registerUser, loginUser,updateUserProfile,getUserProfile,writeReview};
