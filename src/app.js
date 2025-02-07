const express = require("express");
const connectDb = require("./config/database");
const cookiesParser = require("cookie-parser");
const app = express(); //creating our webserver 
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"",  //url for front end 
    methods:["GET","POST"],
    credentials:true,
  },
});

app.use(cors());
app.use(express.json());
app.use(cookiesParser());



const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/messagesRoute");


app.use('/' , authRouter);
app.use('/' , profileRouter);
app.use('/', requestRouter);
app.use('/' , userRouter );
app.use('/', messageRouter);


io.on("connection" , (socket)=>{
  console.log("user connected" ,  socket.id);
})

connectDb().then(()=>{
  console.log("database connected successfully"); 
  server.listen(3000 , ()=>{
    console.log("Server are created a port number 3000");
  });
})
.catch((err)=>{
  console.error("database can not connected"); 
});
