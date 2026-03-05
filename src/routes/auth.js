const express = require('express')
const bcrypt = require('bcrypt')
const authRouter = express.Router()
const {registerValidation} = require("../utils/registerValidation.js")
const User  = require("../models/user.js")


authRouter.post('/signup', async (req, res) => {
  try {
    // STEP 1: Validate input first
    
    const { error, value } = registerValidation(req.body);
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed",
        errors: errorMessages 
      });
    }

    // STEP 2: Check if user already exists (ADD THIS)
    const existingUser = await User.findOne({ emailId: value.emailId });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "User with this email already exists!" 
      });
    }

    // STEP 3: Create and save user
    const {password} = value
    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({ ...value, password: hashedPassword }); 
    await user.save();
    res.status(201).json({ success: true, message: "Data Posting Successful!" });
  } 
  catch (error) {
    res.status(500).json({ success: false, message: "Data Updation Failed! " + error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 1. Validate input
    if (!emailId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User does not exist. Please signup!" 
      });
    }

    // 3. Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // 5. Send response
    const token = await user.getJWT();
      res.cookie("token", token, {
    httpOnly: true,        // prevent JS access
    sameSite: "lax",       // or "none" if using https
    secure: false,         // true only in production https
    expires: new Date(Date.now() + 8 * 3600000)
  });
  
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId
        },
        
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Login failed: " + error.message 
    });
  }
});

authRouter.post("/logout", (req, res)=>{
  res.cookie("token", null, {
    expires : new Date(Date.now()),
  });
  res.send("Logout Successful!")
})



module.exports = authRouter

