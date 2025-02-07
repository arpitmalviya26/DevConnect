const Express = require("express") ;
const messageRoute = Express.Router();
const Messages = require("../models/message");
const userAuth = require("../middleware/auth")
const connectionsReq = require("../models/connectionRequest")

//recents chats and messages recent order
messageRoute.get("/messages" , userAuth , async(req,res)=>{
    try{
        const loggedInUser = req.user._id;

        const recents = await Messages.find({
            $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }]
        })
        .populate("senderId", "firstname lastname ")  
        .populate("receiverId", "firstname lastname");
        //sort for latest chat 

        if(recents.length==0){
            return res.send("start your first chat !!!");
        }

        const users = new Map();

        recents.forEach((message) => {
            if (message.senderId._id.equals(loggedInUser)) {
                users.set(message.receiverId._id.toString(), {
                    firstname : message.receiverId.firstname,
                    lastname : message.receiverId.lastname,
                    latestMessage: message.text
                });
            } else {
                users.set(message.senderId._id.toString(),{
                    firstname: message.senderId.firstname,
                    lastname:message.senderId.lastname,
                    latestMessage:message.text
                });
            }
        });

        const userDetails = Array.from(users.values());
        res.send(userDetails);
    }catch(err){
        res.status(400).send("ERROR :" +err.message);
    }
})


//sending the message 
messageRoute.post("/messages/send" , userAuth , async(req,res)=>{
    try{
        const {receiverId,message} = req.body;
        const senderId = req.user._id;
    
        const isConnected = await connectionsReq.findOne({
            $or: [
              { fromUserId: senderId, toUserId: receiverId, status: "accepted" },
              { fromUserId: receiverId, toUserId: senderId, status: "accepted" }
            ]
        });

        if(!isConnected){
            throw new Error("you are not connected..Connect to Start a Chat");
        }

        const newMessage = new Messages({
            senderId : senderId,
            receiverId : receiverId,
            text:message
        })

        await newMessage.save()
        res.send(newMessage);
    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

//load the chats of users 
messageRoute.get("/chat/:otherUserId" , userAuth , async(req,res)=>{
    try{
        const loggedInUser = req.user._id;
        const otherUserId = req.params.otherUserId;

        if(loggedInUser.equals(otherUserId)){
            throw new Error("you can send message to yourself");
        }

        const isConnected = await connectionsReq.findOne({
            $or: [
                { fromUserId: loggedInUser, toUserId: otherUserId, status: "accepted" },
                { fromUserId: otherUserId, toUserId: loggedInUser, status: "accepted" }
            ]
        })

        if(!isConnected){
            throw new Error ("you can only send message to your connections")
        }

        const messages =await Messages.find({
            $or:[{senderId:loggedInUser , receiverId:otherUserId},
                {senderId:otherUserId , receiverId:loggedInUser}
            ]
        }).sort({timestamp:1})

        if(messages.length==0){
            res.send("start your first conversation");
        }
        
        res.send(messages); 
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
    
}); 
module.exports = messageRoute;