const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted","rejected"],
            message : `{VALUE} is incorrect status`
        },
        required: true

    }
},
{
    timestamps : true,
}
);

connectionRequestSchema.pre("save", function(){
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("You can't send request to yourself");

    }

})

connectionRequestSchema.index(
    {fromUserId: 1, toUserId: 1}
    
)

module.exports = mongoose.model("Connectionrequest", connectionRequestSchema);