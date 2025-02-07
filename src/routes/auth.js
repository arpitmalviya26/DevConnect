const Express = require('express');
const authRouter = Express.Router();
const User = require("../models/user");
const bcrupt = require("bcrypt");
const {ValidateSignUpData} = require("../utils/validation");
const jwt = require('jsonwebtoken');


authRouter.post('/signup' , async(req,res)=>{
    try{
        //Validation Checks 
        ValidateSignUpData(req);
    
        const {firstname,lastname,emailId,password,age,gender} = req.body;
        //Password Encruption
    
        const passwordHash = await bcrupt.hash(password,10);
        console.log(passwordHash);
    
        const user = new User({
          firstname,
          lastname,
          emailId,
          password:passwordHash,
          age,
          gender
        });
    
        await user.save();
        res.status(201).json({message:"User Created Successfully"});
       }catch(err){
        res.status(400).send("ERROR : "+err.message);
       }
}); 


authRouter.post('/login' , async(req,res)=>{
  try{
    const {emailId , password} = req.body ;
    //validate email
    const user = await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("invalid credentials!!");
    }
    //check password
    const isPasswordValid = await bcrupt.compare(password,user.password);
    if(isPasswordValid){
      //AUTHENTICATION
      //create a Jwt Token 
      const token = await jwt.sign({_id:user._id}, 'token123' ,{expiresIn:'7d'});
      //Add a Cookie to token and send response back to user `
      res.cookie("token", token);
      //sending response  
      res.send("Login Successfull!!!")
    }else{ 
      throw new Error("invalid password!!");
    }
  }catch(err){
    res.status(400).send("Error: "+err.message);
  }
});

authRouter.post('/logout' , async(req,res)=>{
  res.cookie("token", null , {
    expires:new Date(Date.now()),
  })
  res.send("Logout Successfull!!!!");
})

module.exports = authRouter;
