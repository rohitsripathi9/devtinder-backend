const express =  require("express")
const connectDB = require('./config/database.js')
const cookieParser = require('cookie-parser')

const app = express()
require("dotenv").config()

const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')
const userRouter = require("./routes/user.js")
const cors = require('cors')

app.use(cors(
    {origin :"http://localhost:5173",
    credentials :true} 
))
app.use(express.json())
app.use(cookieParser()) 

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter)


const PORT = process.env.PORT || 5000
connectDB()
    .then(()=>{
        app.listen(PORT,()=>{
        console.log(`Server Running on ${PORT}`)
        })  
    })

