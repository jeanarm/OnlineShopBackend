const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const generateAuthToken = require("../utils/generateAuthToken");
const { hashPassword } = require("../utils/hashPassword");
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

    if (user) {
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

module.exports = { getUsers, registerUser, loginUser};
