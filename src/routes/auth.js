const express = require("express");
const {validateSignUpdata} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();


authRouter.post("/signUp",async (req,res) => {

      try{

    // first validate the incoming data

    validateSignUpdata(req);

    const {firstName, lastName, emailId, password} = req.body;

    // Encrypt the password 

    const hashedPassword =  await bcrypt.hash(password,10);

    // console.log(hashedPassword);
    
    // save the data in db
    const user = new User({
        firstName,lastName,emailId,password:hashedPassword
    });
    
   // console.log(user);

        await user.save();
        const token = await user.getJWT();

            // add the token to cookie and send the response back to the user
        res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});

        res.json({
            message: "Data saved successfully",
            data : user,
        })

    }
    catch(err){
        res.status(400).send("error" + err);
    }
    
})

authRouter.post("/login", async (req,res) =>{
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        
        if(isPasswordValid){

            // create a jwt token 

            const token = await user.getJWT();

            // add the token to cookie and send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});

            res.send(user);
        }  
        else{
            throw new Error("Invalid credentials");
            console.log('in else block');
        }
    }
    
    catch(err){
        
       res.status(400).send(" Error: " + err.message);
    }
});

authRouter.post("/logout", async (req,res) =>{

    res.cookie("token", null , {expires: new Date(Date.now())});
    res.send("logged out")
})

module.exports = authRouter;