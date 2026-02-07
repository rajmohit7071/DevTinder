const express = require("express");
const {userAuth} = require("../middlewares/auth");
const { validateEditprofileData } = require("../utils/validation");
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req,res) => {
    try{
        
        const user = req.user;
        
        res.send(user); 
    }
    catch(err){
        
        res.status(401).send("Please login");
    }
});

profileRouter.patch("/profile/edit",userAuth, async (req,res) => {

    try{
 

    if(!validateEditprofileData(req)){
       return res.status(400).json({
        message: "Enter A valid gender Type",
       })
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
        message : loggedInUser.firstName + " , your profile updated Successfully!!!",
        data : loggedInUser
    })

    // res.send(loggedInUser.firstName + " , your profile updated Successfully!!!");

    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
});


profileRouter.patch("/profile/password" , async (req,res) =>{

    try{

        const {emailId, newPass, oldPass} =req.body;

        const isNewPasswordOk= validator.isStrongPassword(newPass);
        
        if(!isNewPasswordOk){
         return res.status(401).json({
            message : "Please enter a strong password"})
    }

       const loggedInUser = await User.findOne({emailId : emailId});

       if(!loggedInUser){
        return res.status(401).json({
            message: "Enter a valid email ID"
        })
       }

   //  console.log(loggedInUser);

    const isOldPasswordValid = await loggedInUser.validatePassword(oldPass);

     if(!isOldPasswordValid){
        return res.status(401).json({message :"Old Password is not valid"});
    }
    else{

        // Encrypt the password 
        
        const hashedPassword =  await bcrypt.hash(newPass,10);

        loggedInUser.password =  hashedPassword;
        
        await loggedInUser.save();
        res.json({
            message: "password updated successfully",
            data: loggedInUser
        }
        )
    }

    // if(isNewPasswordOk && isOldPasswordValid){

    //     await loggedInUser.save();
    //     res.json({
    //         message: "password updated successfully",
    //         data: loggedInUser
    //     }
    //     )
    // }
    }catch(err) {
        res.status(400).send("Error: " + err.message);
    }
}
    


)

module.exports = profileRouter;
