const Express =  require('express');
const requestRouter = Express.Router();
const userAuth = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest')
const User = require('../models/user')

requestRouter.post(
    '/request/send/:status/:toUserId',
    userAuth,
    async (req,res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["interested" , "ignored"];

        //checked the allowed status 
        if(!allowedStatus.includes(status)){
            return res
            .status(400)
            .send("Invalid Status :" + status);      
        }

        //Condition to check if fromUserId AND toUserId is same..
        if(fromUserId.equals(toUserId)){
            throw new Error("you can not send connection request to yourself");
        }

        //Check the ToUserId is present on our DB or not
        const checkToUserId = await User.findById(toUserId);
        if(!checkToUserId){
            throw new Error("User Not Found!!!");
        }

       // If There is an Existing Connection Request 
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[{fromUserId,toUserId},
                {fromUserId:toUserId,
                toUserId:fromUserId}
            ],
        })

        if(existingConnectionRequest){
            return res.
                   status(400).
                   send("Already sent an Connection request");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        })
        const data = await connectionRequest.save(); 
        res.json({
            message:req.user.firstname + " is " + status + " in " + checkToUserId.firstname,
            data
        }) 
    }catch(err){
        res.status(400).send("ERROR :" +err.message);
    }
});

requestRouter.post(
    '/request/review/:status/:requestId',
    userAuth,
    async(req,res)=>{
        try{
            const loggedInUser = req.user._id;
            const status = req.params.status;
            const requestId = req.params.requestId;

            //Validate Status of request 
            const allowedStatus = ["accepted" , "rejected"];
            if(!allowedStatus.includes(status)){
                throw new Error("invalid Status!!");
            }

            //validate the request 
            const validateRequest = await ConnectionRequestModel.findOne({
                _id : requestId,
                toUserId : loggedInUser,
                status : "interested",
            })
            if(!validateRequest){
                throw new Error ("invalid credentials!!")
            }
            validateRequest.status = status ;
            const data = await validateRequest.save();
            res.json({message : `connection request ${status}` , data});
        }catch(err){
            res.status(400).send('ERROR : '+err.message);
        }
    }
)


module.exports =  requestRouter ;


