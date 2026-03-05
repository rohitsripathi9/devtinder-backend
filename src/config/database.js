const mongoose = require('mongoose')
require("dotenv").config()

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb Connected!");
    }
    catch(error){
        console.log("Connection failed :",error.message);
        process.exit(1)
    }
}  

module.exports = connectDB;