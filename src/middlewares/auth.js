const jwt = require('jsonwebtoken')
const User = require('../models/user')


const userAuth = async(req,res,next)=>{

    try{
        //read the token from re cookies
        const {token} = req.cookies

        // Validate the token 
        const decodedObj = await jwt.verify(token , "rohitjee55")
        const {_id} = decodedObj
    
        // Find the user 

        const user = await User.findById(_id);
        if(!user){
            return res.status(401).send("Please Login to continue")
        }
        req.user = user
        next();
    }
    catch (error) {
        res.status(400).json({ 
        success: false, 
        message: " Error: " + error.message 
        });
    }
}

module.exports ={userAuth} 