const mongoose = require('mongoose') ;

const connectDb = async()=>{
    await mongoose.connect('mongodb+srv://NamasteNode:d%40n3apv4z_75Yib@devconnect.akmmz.mongodb.net/devConnect');
};

module.exports = connectDb;