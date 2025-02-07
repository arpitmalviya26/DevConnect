const mongoose = require('mongoose') ;

const connectDb = async()=>{
    await mongoose.connect('#Your Connection String');
};

module.exports = connectDb;
