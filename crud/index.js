const express = require("express")
const app = express()
const port = 3000
const path = require("path")
const userModel = require(".//models/user")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname ,'public')))
app.set("view engine", "ejs")

app.get("/",(req,res)=>{
    res.render("App")                               //1  //index.ejs 2
})

app.get("/read", async(req,res)=>{                     //3  //read.ejs 4
    let allusers = await userModel.find()  //7 userModel bhejte hi hame user ko read karna hoga
    res.render("read" , {users : allusers})
})
app.get("/delete/:id", async(req,res)=>{
   let users = await userModel.findOneAndDelete({_id:req.params.id})
   res.redirect("/read")
})

app.get("/edit/:userid", async(req,res)=>{
   let user = await userModel.findOne({ _id : req.params.userid })
   res.render("edit" , {user})
})

app.post("/update/:userid", async(req,res)=>{
    let {image,name,email} = req.body
   let user = await userModel.findOneAndUpdate({ _id : req.params.userid },{image,name,email},{new:true})
   res.redirect("/read")
})

app.post("/create", async(req,res)=>{   //5 //6-usermodel
    let {name,email, image} = req.body
    let createUser = await userModel.create({
        name,
        email,
        image
    })
    res.redirect("/read")
})

app.listen(port)

//name:name tha isliye name likha same ho to likh sakte hai 