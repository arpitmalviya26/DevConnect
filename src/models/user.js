const mongoose = require('mongoose') ;

const userSchema = mongoose.Schema({
    firstname : {
        type : String ,
        required : [true , 'Firstname is Required'],
        minLength : ['4' , 'firstname should be greater than 4 characters'],
        maxLength:['20','firstname should be less than 20 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Firstname can only contain letters, numbers, and underscores'],
    } ,
    lastname :{
        type : String ,
        required : [true,"Lastname is Required"],
        maxLength:['20','lastname should be less than 20 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'lastname can only contain letters, numbers, and underscores'],
    },
    emailId :{
        type : String,
        required:[true,'Entre mail'],
        unique:[true,'emailId already registered']
    },
    password : {
        type : String ,
        required:[true,'Entre password'],
        minLength:[8,'length should be greater than 8'],
        //unique:true,
    },
    age:{
        type : Number,
        required:true,
        min:[18 , 'age should be greator than 18'],
    },
    gender : {
        type : String,
        required:true, 
        enum :{values: ['Male', 'Female' , 'Other'], message: `Value is not supported`} ,
    },
    skills:{
        type : [String] ,
        required : false ,
        validate : {
            validator : function(skills){
                return skills.length<=5;
            },
            message : 'you can add maximum 5 Skills'
        }
    },
    photoURL :{
        type:String,
        required:false,
    },
    about :{
        type: String,
        required:false,
        maxlength:[300,'Only add Upto 300 words']
    }
},
{
    timestamps:true,
    trim:true,
});



module.exports =  mongoose.model('User' , userSchema) ;