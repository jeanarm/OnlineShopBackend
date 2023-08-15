const express = require('express')
const app = express()

const productRoutes = require("./productRoutes")
const categoryRoutes = require("./categoriesRoutes")
const userRoutes = require("./userRoutes")
const orderRoutes = require("./ordersRoutes")

app.use("/products",productRoutes)
app.use("/category",categoryRoutes)
app.use("/users",userRoutes)
app.use("/orders",orderRoutes)



module.exports = app