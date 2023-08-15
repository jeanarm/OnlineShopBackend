const express = require('express');
const  router = express.Router();


const {getCategories, newCategory, deleteCategory,saveAttr }= require('../controllers/categoryController')
router.get("/", getCategories)
router.post("/", newCategory)
router.delete("/", deleteCategory)
router.post("/attrs", saveAttr)
module.exports = router