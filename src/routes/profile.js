const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require("../middlewares/auth.js")
const {profileEditValidation} = require("../utils/registerValidation")


profileRouter.get("/profile/view",userAuth , async(req,res)=>{
  try{
  const user  = req.user
  res.send(user)
  }
  
  catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Login failed: " + error.message 
    });
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("No data provided to edit");
    }

    if (!profileEditValidation(req)) {
      throw new Error("Cannot edit these fields");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();

    res.json({
      success: true,
      data: loggedInUser,
      message: "Edit successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cant edit retry: " + error.message,
    });
  }
});




module.exports = profileRouter