const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user")
const bcrupt = require("bcrypt")
const {ValidateSignUpData} = require("./utils/validation")
const cookiesParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {auth} = require('./middleware/auth');

const app = express(); //creating our webserver 

app.use(express.json());
app.use(cookiesParser());

// API signUp -> adding a data to database
app.post('/signup' , async(req,res)=>{
   try{
    //Validation Checks 
    ValidateSignUpData(req);

    const {firstname,lastname,emailId,password} = req.body;
    //Password Encruption

    const passwordHash = await bcrupt.hash(password,10);
    console.log(passwordHash);

    const user = new User({
      firstname,
      lastname,
      emailId,
      password:passwordHash,
    });

    await user.save();
    res.send("User Saved Successfully");
   }catch(err){
    res.status(400).send("ERROR : "+err.message);
   }
})

app.post('/login' ,async(req,res)=>{
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
      const token = await jwt.sign({_id:user._id}, 'token123' , {expiresIn:'7d'});
      //Add a Cookie to token and send response back to user 
      res.cookie("token", token);
      //sending response 
      res.send("Login Successfull!!!")
    }else{
      throw new Error("invalid credentials!!");
    }
  }catch(err){
    res.status(400).send("ERROR : "+err.message);
  }
})

app.get('/profile' ,auth, async(req,res)=>{
  try{
    const data = await req.user;
    res.send(data); 
  }catch(err){ 
    res.status(400).send("Enable To load Profile");
  }
})



connectDb().then(()=>{
  console.log("database connected successfully"); 
  app.listen(3000 , ()=>{
    console.log("Server are created a port number 3000");
  });
})
.catch((err)=>{
  console.error("database can not connected"); 
});