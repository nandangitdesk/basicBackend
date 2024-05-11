const express = require("express")
const app = express()
const port = 3000
const path = require("path")
const fs = require("fs")
const { clear } = require("console")

app.use(express.json());   // ''''''
app.use(express.urlencoded({extended:true}))// parsers we are not using body parsers but still this is for practice purpose
app.use(express.static(path.join(__dirname , 'public'))) //ye sab images,javascript,styles ko public folder me dalke use kar payenge
app.set("view engine" , "ejs")


app.get("/",function(req,res){
    fs.readdir("./files",function(err,files){  // pehle ye func chale fir render chale
        
        res.render("index" ,{files:files})
    })
})

app.get("/file/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8" , function( err , filedata) {

        res.render("show", { filename: req.params.filename , filedata: filedata });
    }) 
})

app.get("/edit/:filename",function(req,res){
  res.render("edit",{filename: req.params.filename}) 
})


app.post("/edit",function(req,res){
   fs.rename(`./files/${req.body.prev}` , `./files/${req.body.New}` , function(err){
    res.redirect("/")
   })
})


app.post("/delete/:filename",function(req,res){
   fs.unlink(`./files/${req.params.filename}`,function(err){
    res.redirect("/")
   })
 })
    


app.post("/create" , function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details ,function(err){
        
        res.redirect("/"); 
    });
})    

app.listen(port)

//re.redirect vaps / route par jata hai or fir same readdir karta hai but ye sab tab hoga jab write file chalega 
