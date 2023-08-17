const express = require('express');
const  router = express.Router();


const {getCategories, newCategory, deleteCategory,saveAttr }= require('../controllers/categoryController')
const {verifyIsloggedIn, verifyIsAdmin}=require("../middleware/verifyAuthToken")

router.use(verifyIsloggedIn)
router.use(verifyIsAdmin)
router.get("/", getCategories)
router.post("/", newCategory)
router.delete("/:category", deleteCategory)
router.post("/attrs", saveAttr)
module.exports = router