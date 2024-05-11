const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const port = 3000
const path = require("path")
const userModel = require("../Auth-part2/models/user")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())

app.get("/" , (req,res)=>{
   res.render("index")
})

app.post("/create" , (req,res)=>{
   
   let {username,email,password,age}= req.body

   bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash("nandan123", salt, async(err, hash)=> {

          // Store hash in your password DB.

          let createdUser = await userModel.create({
            username,
            email,
            password : hash,
            age
           })
          
           let token = jwt.sign({email},"secretkeypassing")
           res.cookie("token" ,token)
           res.send(createdUser)
      });
  });


})

app.get("/login", (req,res)=>{
  res.render("login")
})

app.post("/login", async (req,res)=>{
   let user = await userModel.findOne({email: req.body.email})
   if(!user) return res.send("user not found")

   bcrypt.compare(req.body.password, user.password, function(err, result) {  
      //req.body.password jo form ke through aaha hai 
      //user.password ye user ke pass saved hai already do no compare karenge agar true aya to profile page par bhejenge

      // result == true
   
      if(result){
         
         let token = jwt.sign({email:user.email},"secretkeypassing")
         res.cookie("token" ,token)
         res.send("Yes u can login")
      }else{
         res.send("something is wrong")
      }

  });
})

app.get("/logout",(req,res)=>{
   res.cookie("token","")
   res.redirect("/")
})

app.listen(port)