const Express = require("express");
const profileRouter = Express.Router();
const userAuth = require('../middleware/auth');
const User = require('../models/user');
const {ValidateEditProfileData} = require('../utils/validation');
const bcrypt = require('bcrypt');
const validator = require("validator");


profileRouter.get('/profile/view' ,userAuth , async(req,res)=>{
    try{
      const data = await req.user;
      if(!data){
        throw new Error("Enable to load");
      }
      res.send(data); 
    }catch(err){ 
      res.status(400).send("Enable To load Profile");
    }
});

//API TO EDIT OR UPDATE YOUR PROFILE DATA 
profileRouter.patch('/profile/edit' , userAuth ,async(req,res)=>{
  try{
    if(!ValidateEditProfileData){
      throw new Error ("Invalid Edit Request!!!");
    }
    //req.user => user jisne api to request kiya 
    //req.body => jo change krne ko bola
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key)=> (loggedInUser[key]=req.body[key]))
    await loggedInUser.save();
    res.send(` ${loggedInUser.firstname} your profile has been Updated`);
  }catch(err){
    res.status(400).send("ERROR : "+err.message);
  }
});

//PASSWORD UPDATE => API for updating the password
profileRouter.patch('/profile/password' , userAuth , async(req,res)=>{
  try{
    const {password,newPassword} = req.body ;
    const match = await bcrypt.compare(password,req.user.password);
    if(!match){
      throw new Error('Password not matched');
    }
    if(!validator.isStrongPassword(newPassword)){
      throw new Error("Entre Strong Password");
    }
    //hashcode you password and store into Db 
    const hash = await bcrypt.hash(newPassword,10);
    const {_id} = req.user._id
    const updateUser = await User.findByIdAndUpdate({_id:_id} , {password:hash});
    updateUser.save();
    res.send("Password Updated Successfully");
  }catch(err){
    res.status(400).send("ERROR : "+err.message);
  }
});

module.exports = profileRouter;