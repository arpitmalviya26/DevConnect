const Express = require('express');
const userRouter = Express.Router();
const userAuth = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = ["firstname","lastname","skills"]

//Get All the pending request of user 
userRouter.get(
    '/user/request',
    userAuth,
    async (req,res)=>{
        try{
            const {_id} = req.user;
            console.log(_id);
            const connectionRequest = await ConnectionRequestModel.find({
                toUserId:_id,
                status:"interested",
            }).populate("fromUserId" , USER_SAFE_DATA)
            
            res.json({
                message:"Connection Requests" ,
                connectionRequest
            })            
        }catch(err){
            res.status(400).send("ERROR : "+err.message);
        }
    } 
) 

//Get all the Connection User has 
userRouter.get(
    '/user/connections',
    userAuth,
    async(req,res)=>{
        try{
            const {_id} = req.user;
            const connections = await ConnectionRequestModel.find({
                $or:[
                    {fromUserId:_id , status:"accepted"},
                    {toUserId:_id , status:"accepted"}
                ]
            }).populate("fromUserId" , USER_SAFE_DATA)
              .populate("toUserId" , USER_SAFE_DATA);


            const data = connections.map((row)=>{
                if(row.fromUserId._id.toString() === _id.toString()){
                    return row.toUserId;
                }else{
                    return row.fromUserId;
                }
            })
   
            res.json({
                message:'connections are : ',
                data                 
            })
        }catch(err){
            res.status(400).send('ERROR : '+err.message);
        }
    }
)

userRouter.get(
    '/feed',
    userAuth,
    async(req,res)=>{
        try{
            const loggedInUser = req.user._id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip  = (page-1)*limit;
            
            const ConnectionRequests = await ConnectionRequestModel.find({
                $or:[
                    {fromUserId:loggedInUser},
                    {toUserId:loggedInUser}
                ]
            }).select("fromUserId toUserId");

            const hideUserFromFeed = new Set();
            ConnectionRequests.forEach((key)=>{
                hideUserFromFeed.add(key.fromUserId.toString());
                hideUserFromFeed.add(key.toUserId.toString());
            })

            const feeduser = await User.find({
                $and:[{_id : {$nin: Array.from(hideUserFromFeed)}},{_id :{$ne : loggedInUser}}]
            })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);
              
             
            res.json({
                message:"Loading Completed..." , 
                feeduser
            });        
        }catch(err){
            res.status(400).send("ERROR : "+err.message);
        }
    }
)

module.exports = userRouter ; 
 
