
const express = require('express')
const app = express()
const port = 5000
const fileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(fileUpload())
app.use(cookieParser())

const apiRoutes= require("./routes/apiRoutes")
  
app.get('/',  async (req, res, next) => {
        
res.json('API running....')

})

//mongodb connection setup

const connectDB = require("./config/db")

connectDB()

app.use("/api",apiRoutes)

app.use((error,req,res,next)=>{
  if(process.env.NODE_ENV === "development"){
    console.error(error)
  }
  next(error)
})

app.use((error,req,res,next) =>{
  if(process.env.NODE_ENV === "development"){
    res.status(500).json({
      message:error.message,
      stack:error.stack
  })
  }else{
    res.status(500).json({
      message:error.message
  })

  }
   
})

app.listen(port, () => {
  console.log(`App Running and listening on port ${port}`)
})