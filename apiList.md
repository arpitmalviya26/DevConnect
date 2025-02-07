# API's in Dev Connect #

*authRouter*
- <POST /SignUp   
- <POST /login    
- <POST /logout   

---------------------------------------------------------------------------------------
*profileRouter*
- <GET /profile/view           
- <PATCH /profile/edit         
- <PATCH /profile/password  {`validate the old password with new or forget options`} 

---------------------------------------------------------------------------------------
*connectionRequestRouter*  [/request.js]
- <POST /request/send/interested/:userId  
- <POST /request/send/ignored/:userId
*we can make this above 2 api dynamically*
- <POST /request/send/:status/:toUserId     {for interested or ignore}


- <POST /request/review/accepted/:requestId
- <POST /request/review/rejected/:requestId
*we can make this above 2 api dynamically*
- <POST /request/review/:status/:requestId  {for accepted or reject}

---------------------------------------------------------------------------------------
*UserRouter*
- <GET /user/connections 
- <GET /user/request 
- <GET /user/feed 
 
---------------------------------------------------------------------------------------
*Some Extra Api's*
- <GET /search  

**MESSAGE SECTION PENDING**

- <GET /messages    {chats section}
- <GET /messages/:chatId {open particular chats}
- <POST /messages/send/  {send messages made up using websockets}





