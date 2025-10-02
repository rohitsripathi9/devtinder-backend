const express =  require("express")
const app = express()

app.get("/",(req,res)=>{
    res.send("ha vintunna")
})

app.get("/hello",(req,res)=>{
    res.send("entra")
})

app.listen(3000,()=>{
    console.log("server  started")
})
