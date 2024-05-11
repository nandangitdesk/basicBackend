const cookieParser = require("cookie-parser")
const expresss = require("express")
const app = expresss()
const port = 3000
const bcrypt = require("bcrypt")   // use hoti hai encryption or decryption ke liye
var jwt = require('jsonwebtoken');

app.use(cookieParser())


//10 default saltround
app.get("/" , (req,res)=>{
   //how to encrypt work

    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash("mypasswordisnandan", salt, function(err, hash) {
    //         // Store hash in your password DB.
    //         console.log(hash);
    //     });
    // });


    //how we compare or decrypt work

    // bcrypt.compare("mypasswordisnandan", "$2b$10$s9j6WfKmos9Zmz8qOSk0AeYsFckvxQRaKIt.xEIo7nJ0qn46qLkFm", function(err, result) {
    //     // result == true
    //     console.log(result);
    // });
 
  const token = jwt.sign({email:"nandan@example.com"} ,"secret") //ye secret bohot imp hota hai isse hamesha secret rakhna hota hai or isse likna bhi jara kathin tarike se hard bolna chata hu
   
  res.cookie("token",token)
  res.send("cookie is set using jwt")
})

app.get("/read",(req,res)=>{
    // console.log(req.cookies.token);
    
    //data aise dekhte hai
    const data = jwt.verify(req.cookies.token,"secret")
    console.log(data);
})


app.listen(port)