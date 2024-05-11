const express = require("express");
const port = 3000;
const app = express();

app.use(function(req,res,next){
  console.log("middle ware chala");
  next()
})

app.get("/", (req, res) => {
  res.send("Request Printed");
});

app.get("/about", (req, res) => {
  res.send("this is the about page");
});


//error handling
app.get("/profile", (req, res,next) => {
 return next(new Error("Something went wrong"))
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.listen(port);
