const validator = require('validator');

const validateSignUpdata = (req) =>{

    const {firstName, lastName, emailId, password} = req.body;

    if(! firstName || ! lastName){
        throw new Error("enter a name ");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email id is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }
}

const validateEditprofileData = (req) =>{
    const ALLOWED_UPDATES = ["firstName", "lastName" , "age", "photoUrl","about", "Skills", "gender"];

    const isUpdateAllowed = Object.keys(req.body).every(field => ALLOWED_UPDATES.includes(field));

    return isUpdateAllowed;
}

module.exports = {validateSignUpdata, validateEditprofileData};