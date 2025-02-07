const mongoose = require("mongoose") ;

const messageSchema = mongoose.Schema({
    senderId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true 
    },
    text:{
        type : String,
        maxLength:[200 ,"message is to longer , should be less than 200 words"]
    },
    image:{
        type:String,
    }
},
{
    timestamps:true
})

messageSchema.index({senderId:1 , receiverId:1})

const messageModel = mongoose.model("message" , messageSchema);

module.exports = messageModel;