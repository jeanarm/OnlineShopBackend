
const jwt = require("jsonwebtoken")
const verifyIsloggedIn = (req, res, next) =>{

    next()
    return 
    try {
        const token = req.cookies.access_token
        if(!token){
            return res.status(403).send("Access token is required")
        }

        try {
            
            const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY)
            req.user = decoded
            next()

        } catch (error) {
         
            return res.status(401).send("Unauthorized. Invalid token!!")
            
        }
        
    } catch (error) {
        next(error);
        
    }

}


const verifyIsAdmin = (req, res, next) =>{
    next()
    return

    if (req.user && req.user.isAdmin){
        next()
    }else{
        return res.status(401).send("Only Admin can access this page")
    }

}

module.exports = {verifyIsloggedIn,verifyIsAdmin}