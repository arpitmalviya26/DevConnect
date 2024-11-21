const express = require("express");

const app = express(); //creating our webserver 

// app.use("/test" , (req,res)=>{
//     res.send("Hello From the server");
// })

app.use("/test2" , (req,res)=>{
    res.send("Hello hellow hello");
})

app.listen(3000 , ()=>{
    console.log("Server are created a port number 3000");
}); //assigned an port number , you have created a server on port 3000 , and application is listening on that server

 