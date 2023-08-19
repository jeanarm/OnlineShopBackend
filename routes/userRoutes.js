const express = require('express');
const  router = express.Router();


const {getUsers,registerUser,loginUser,updateUserProfile,getUserProfile,writeReview} = require('../controllers/userController');
const { verifyIsloggedIn, verifyIsAdmin } = require('../middleware/verifyAuthToken');

router.post("/register", registerUser)
router.post("/login", loginUser)
//user logged in routes:
router.use(verifyIsloggedIn)
router.put("/profile", updateUserProfile);
router.get("/profile/:id",getUserProfile)
router.post("/review/:productId",writeReview)
//admin routes:
router.use(verifyIsAdmin)
router.get("/", getUsers)
module.exports = router