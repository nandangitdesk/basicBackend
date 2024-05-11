//Goals today-
//Dynamic routing✅
//how to get data coming from frontend at backend route✅
//setting up parsers for form✅
//setting up ejs for ejs pages - install ejs - npm i ejs - setup as a view engine✅
//setting up public static files✅


const express = require("express");
const app = express();
const path = require("path")

app.use(express.json());   // ''''''
app.use(express.urlencoded({extended:true}))// parsers we are not using body parsers but still this is for practice purpose
app.use(express.static(path.join(__dirname , 'public'))) //ye sab images,javascript,styles ko public folder me dalke use kar payenge
app.set("view engine" , "ejs")

app.get("/",function(req,res){
    res.render("index")  //ab hum ye route pe jate hi views ke ander ka page khulega, render ke sath views ke andar ke page ka namm likhenge without extension
})

app.get("/profile/:username",function(req,res){
    // req.params.username   //req.params ka matlab jiske age : colan likha ho 
    //pehle humne frontend se username ki value behji backend ko vo value /:username yaha store hui fir hamne wahi value frontend ko bheji as a response yaha niche dekho 
    res.send(`welcome,${req.params.username}`)
})

app.get("/author/:username/:age",function(req,res){
    res.send(`welcome , ${req.params.username} of ${req.params.age}`)
})

app.listen(3000,function(){
    console.log("its running")
})