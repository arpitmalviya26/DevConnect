const validator = require("validator");
//{firstname , lastname , emailId , password}

const ValidateSignUpData = (req)=>{
    const {firstname,lastname,emailId,password} = req.body ;

    if(!firstname || !lastname){
        throw new Error ("Name is Not Valid!!!");
    }else if(!validator.isEmail(emailId)){
        throw new Error ("EmailId is not Valid!!!");
    }else if(!validator.isStrongPassword(password)){
        throw new Error ("Entre a Strong Passsword!!!");
    }
}

const ValidateEditProfileData = (req)=>{
    const allowedEditFields = [
        "firstname",
        "lastname",
        "age",
        "gender",
        "skills",
        "about"
    ];
    const isEditAllowed = Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
}

module.exports = {
    ValidateSignUpData,
    ValidateEditProfileData,
}
