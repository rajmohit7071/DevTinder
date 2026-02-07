const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) =>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus){
            return res.status(400).json({ message : "Invalid status type" + status})
        }

        const isToUserIdValid = await User.findOne({_id:toUserId});

        if(!isToUserIdValid){
            throw new Error("Enter a valid user to send a req.")
        }

        // const sent = ConnectionRequest.findOne({fromUserId, toUserId});
        // const received = ConnectionRequest.findOne({fromUserId: toUserId, toUserId: fromUserId});

        // if(sent || received){
        //     res.status(400).json({
        //         message: "Connection already exists",
        //     })
        // };

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        // console.log("existing" + existingRequest );
        
        if(existingRequest){
           return  res.status(400).json({
                message: "Connection already exist",
            })
        }



        // creating connection & saving in db

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId,status,
        });

       const data =  await connectionRequest.save();

       res.json({
        message: "Connection request " + status + " successfully",
        data,
       })
    }
    catch(err){
        res.status(400).json({
            "Error" : err.message
        })
    }

})

requestRouter.post("/request/review/:status/:requestId" ,userAuth, async (req,res) =>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message : status + " is not a valid status type"
            })
        }
    //    checking first status should be interested, 
    //    requestId should be available in db, 
    //    and toUserId should be loggedInUerId
    
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        });

        if(!connectionRequest){
            return res.status(400).json({
                message: "Connection request not found",
            })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request " + status + " successfully",
            data
        })
    }
    catch(err){
        res.status(400).json({
            message: err.message,
        })
    }
})




module.exports = requestRouter;