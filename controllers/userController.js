const User = require('../models/UserModel');
const bcrypt = require("bcryptjs")

const {hashPassword} = require("../utils/hashPassword");
const getUsers = async (req, res, next) => {

    try {
        const users = await User.find({}).select("-password")
        res.json(users);
        
    } catch (error) {
        next(error);
        
    }
}


const registerUser = async (req, res, next) => {

    try {
        const {name,lastName,email,password} = req.body
        
        if(!(name && lastName && email && password)){
            return res.status(400).json({message: "All inpus are required"})
        }
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(400).json({message: "User already exists"})
        }else{
            const hashedPassword = hashPassword(password)
            const user =  await User.create({
                name,
                lastName,
                email:email.toLowerCase(),
                password:hashedPassword
            })
            
            res.status(201).send(user)
        }
        

    } catch (error) {
        next(error);
        
    }
}


module.exports = {getUsers,registerUser}