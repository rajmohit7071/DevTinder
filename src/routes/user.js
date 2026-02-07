const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const express = require("express");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about gender age"

userRouter.get("/user/request/received", userAuth, async (req,res) =>{
    try{

        const loggedInUserId = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUserId._id,
            status : "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

        console.log(connectionRequest);
        

       // const data = connectionRequest.map((row) => row.fromUserId);

        res.json({
            message: "Data fetched Successfully",
            data : connectionRequest,
        });

    }
    catch(err){
        res.status(400).json({
            "Error: " : err.message,
        })
    }
});

userRouter.get("/user/connection", userAuth, async (req,res) =>{
    try{

        const loggedInUserId = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                
                  { fromUserId: loggedInUserId._id, status: "accepted" },
                  {toUserId:loggedInUserId._id , status:"accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

      // console.log(connectionRequests);

        const data = connectionRequests.map((row) => {

            if(row.fromUserId._id.equals(loggedInUserId._id.toString())){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message: "These are " + loggedInUserId.firstName + " connections",
            data
        });

    }
    catch(err){
        res.status(400).json({
            "Error: " : err.message,
        })
    }
})

userRouter.get("/feed", userAuth, async (req,res) =>{

    try{

        const loggedInUser = req.user;
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

         limit = limit > 50 ? 50 : limit;

        const skip = (page-1)*limit;
        

        const connectionRequests = await ConnectionRequest.find({
            $or: [
            {fromUserId : loggedInUser._id},
            {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequests.forEach((req) =>{
            hideUserFromFeed.add((req.fromUserId.toString()));
            hideUserFromFeed.add((req.toUserId.toString()));
        });

        const users = await User.find({

            $and: [
                {_id: {$nin : Array.from(hideUserFromFeed)}},
                {_id: {$ne : loggedInUser._id}}
            ],
        }).skip(skip).limit(limit);

    

        res.json(users);
    }
    catch(err){
        res.status(500).json({
            "Error : " : err.message,
        })
    }
})


module.exports = userRouter;