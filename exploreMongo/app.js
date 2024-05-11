const express = require("express");
const app = express();
const port = 3000;
const userModel = require("./userModel")

app.get("/",function(req,res){
    res.send("hey")
})


app.get("/create", async (req,res)=>{
    const createdUser = await userModel.create({
        name :"Namdev",
        username : "namdev_one",
        email : "abc3@email.com"

    })
    res.send(createdUser)
})

app.get("/update", async (req,res)=>{
    const updateUser = await userModel.findOneAndUpdate({username:"nandan_one"},{name:"Nandan Namdev Patil"},{new : true})
    res.send(updateUser)
})

app.get("/read", async (req,res)=>{
    // const readUser = await userModel.find({name:"namdev"}) //find hame ek array dega agr user iss naam ka nah ho tab bhi khali array dega
    // const readUser = await userModel.findOne({name:"namdev"}) // agar findOne use karenge tab galat user par kuch nahi milega 
    const readUser = await userModel.find({name:"Namdev"}) // sab ko read karn aho to sirf find(); method use karegne
    res.send(readUser)
})

app.get("/delete", async (req,res)=>{
    const deleteUser = await userModel.findOneAndDelete({name:"Nandan"})
    res.send(deleteUser)
})

app.listen(port)