const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    firstName: {
        type : String,
        required : true,
        minLength: 3,
        maxlength : 20,
    },
    lastName: {
        type : String,
    },
    emailId : {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email Id is not valid" + value);
        }
        },
        
    },
    password :{
        type : String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong Password " + value +  "  --the given password doesn't meet criteria");
            }
        }
    },
    age :{
        type : Number,
    },
    photoUrl:{
        type : String,
        default: "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"
    },
    about :{
        type: String,
        default : "Hey there !!! ",

    },
    gender :{
        type : String,
        enum:{
            values: ["Male","Female", "Other"],
            message: `{VALUE} is not a valid a gender`
        },
        // validate(value) {
        //     if(!["male","female", "other"].includes(value)){
        //         throw new Error("Gender is not valid");
        //         }
        // }
    },
    Skills :{
        type : [String],
    }

},
{
    timestamps :true,
}
);

userSchema.methods.getJWT = async function (){
    const user = this;

    const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn : "8h"});

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;

    const hashedPassword = user.password;

    const isPasswordValid = bcrypt.compare(passwordInputByUser,hashedPassword);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);