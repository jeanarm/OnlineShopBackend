
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const apiRoutes= require("./routes/apiRoutes")
  
app.get('/',  async (req, res, next) => {
        
res.json('API running....')

})

//mongodb connection setup

const connectDB = require("./config/db")

connectDB()

app.use("/api",apiRoutes)

app.use((error,req,res,next) =>{
    res.status(500).json({
        message:error.message,
        stack:error.stack
    })
})

app.listen(port, () => {
  console.log(`App Running and listening on port ${port}`)
})