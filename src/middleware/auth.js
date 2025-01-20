const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req,res,next)=>{
  try{
    const cookies = req.cookies ;
    const {token} = cookies ;
    if(!token){
      throw new Error("Token is INVALID !!!!")
    }
    //validate token 
    const DECODE_TOKEN =await jwt.verify(token,'token123');
    const {_id} = DECODE_TOKEN;

    const UserData =await User.findOne({_id:_id});
    if(!UserData){
      throw new Error("User Not Found!!!!");
    }
    req.user = UserData;
    next();
  }catch(err){
    res.send("ERROR : "+ err.message);
  }
}

module.exports = {
  auth, 
}