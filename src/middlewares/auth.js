const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) =>{
    const {token} = req.cookies;
// console.log(token);
    try{
    if(!token)
    {
      return res.status(401).json( {message: "Invalid token kindly login"});
    // throw new Error("please login" )
    }

    // validating the token

    const decodedMessage = await jwt.verify(token, "Dev@Tinder#");

    
    const {_id} = decodedMessage;

    // console.log("Logged in user is: " + _id);
            
    const user = await User.findById(_id);
            
     if(!user){
         throw new Error("User does not exist");
        }
        // attach data as a property on req
        req.user = user;
    next();
}
catch(err){
    res.status(400).send("Error :" + err.message);
}
}

module.exports = {userAuth};