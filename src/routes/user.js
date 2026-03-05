const express = require('express');
const {userAuth} = require('../middlewares/auth')
const userRouter = express.Router()
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

USER_SAFE_DATA = "firstName lastName age gender skills photoUrl address"


userRouter.get('/user/request/recieved',userAuth , async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",USER_SAFE_DATA);

        res.status(200).json({
            message: "Connection requests fetched successfully",
            data: connectionRequests,
        });
    }
    catch(error){
        res.status(400).json({
            message:"Error fetching connectin requests",
            error : error.message,
        })

    }
})

userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id , status :"accepted"},
                {fromUserId :loggedInUser._id , status :"accepted"}
            ],
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        const data = connectionRequests.map((row)=>{
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        }
            
        )


        res.status(200).json({data:data,
            message:"These are you connections"
        })

    }
    catch(error){
        res.status(400).json({
            message:"Failed to fetch connections",
            error: error.mesage,
            success: false
        })
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1) * limit ;

        const connectionRequests = await ConnectionRequest.find({
           $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
            ],
        }).select('fromUserId toUserId');

        const hiddenUsersFromFeed = new Set();
        connectionRequests.forEach((request)=>{
            hiddenUsersFromFeed.add(request.fromUserId.toString());
            hiddenUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and:[
                { _id : { $nin : Array.from(hiddenUsersFromFeed)} },
                {_id :{ $ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.json({data:users})


    }
    catch(error){
        res.status(400).json({message:"error Loading feed",
            error : error.message
        })
    }
})

module.exports = userRouter;