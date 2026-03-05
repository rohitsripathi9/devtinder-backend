const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const mongoose = require('mongoose')

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // 1. Declare properly
    const isAllowedStatus = ['interested', 'ignored'];
    if (!isAllowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: " + status });
    }

    // valid MongoDB ObjectId (a 24-character hex string)
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // 2. Add await here, and fix findById syntax
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Convert ObjectIds to string before comparing
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ message: "Sorry, you can't send a request to yourself" });
    }

    // 4. Fix duplicate check 
    const existingconnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingconnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists!" });
    }

    // 5. Create and save new request
    const connectionRequest = new ConnectionRequest({
      toUserId,
      fromUserId,
      status
    });
    await connectionRequest.save();

    // 6. Success response
    return res.status(200).json({
      success: true,
      message: "Request sent from " + req.user.firstName + " to " + toUser.firstName,
    });

  } catch (error) {
    console.error("Error in /request/send:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

requestRouter.post('/request/review/:status/:requestId',userAuth, async(req,res)=>{
  try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params

    const allowedStatus = ["accepted", "rejected"]
    if (!allowedStatus.includes(status)){
      return res.status(400).json({message:"Status not allowed"})
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id : requestId,
      toUserId : loggedInUser._id,
      status : "interested"
    });

    if(!connectionRequest){
      return res.status(404).json({message:'Connection request not found'})
    }

    connectionRequest.status = status

    const data = await connectionRequest.save()

    return res.status(200).json({message:'Connection Request'+ status, data})
    
  }
  catch (error) {
  console.error("Error in /request/review:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message
  });
  }
})

module.exports = requestRouter;
