const express = require("express");
const app = express();
const port = 3000;
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path")
const crypto = require("crypto")
const upload = require("./config/multerconfig")

app.use(express.json()); // ''''''
app.use(express.urlencoded({ extended: true })); // parsers we are not using body parsers but still this is for practice purpose
app.use(express.static(path.join(__dirname , 'public'))) //ye sab images,javascript,styles ko public folder me dalke use kar payenge
app.set("view engine", "ejs");
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile/upload", (req, res) => {
  res.render("profileupload");
});

app.post("/upload", isLoggedIn , upload.single("image") ,async(req,res)=>{
  let user = await userModel.findOne({email:req.user.email})
  user.profilepic =req.file.filename;
  await user.save();
  res.redirect("/profile")
})

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  let { email, password, age, name, username } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("user already registered");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async function (err, hash) {
      let user = await userModel.create({
        username,
        name,
        age,
        email,
        password: hash,
      });
      const token = jwt.sign(
        { email: email, userid: user._id },
        "secretkeypassing"
      );
      res.cookie("token", token);
      res.send("registered");
    });
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("Something went wrong");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      const token = jwt.sign(
        { email: email, userid: user._id },
        "secretkeypassing"
      );
      res.cookie("token", token);
      return res.status(200).redirect("/profile");
    } else res.redirect("/login");
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/profile", isLoggedIn, async(req, res) => {

  let user = await userModel.findOne({email:req.user.email}).populate("posts")
  res.render("profile",{user});
});

app.get("/like/:id", isLoggedIn, async(req, res) => {

  let post = await postModel.findOne({_id:req.params.id}).populate("user")
  if(post.likes.indexOf(req.user.userid )===-1){
    post.likes.push(req.user.userid)
  }else{
    post.likes.splice(post.likes.indexOf(req.user.userid),1)
  }
  await post.save()
  res.redirect("/profile")

});

app.get("/edit/:id", isLoggedIn, async(req, res) => {

  let post = await postModel.findOne({_id:req.params.id}).populate("user")
 
  res.render("edit",{post})
});

app.post("/update/:id", isLoggedIn, async(req, res) => {

  let post = await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
 
  res.redirect("/profile")
});



app.post("/post",isLoggedIn,async(req,res)=>{
  let user = await userModel.findOne({email:req.user.email})
  let {content} = req.body
  let post = await postModel.create({
    user: user._id,
    content
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect("/profile")
})

app.get("/delete/:id",isLoggedIn, async(req,res)=>{
  let post = await postModel.findOneAndDelete({_id:req.params.id})
  let user = await userModel.findOne({ _id: post.user });
      // Remove the deleted post ID from the user's posts array
      user.posts = user.posts.filter((postId) => postId.toString() !== req.params.id);
          // Save the updated user document
    await user.save();


  res.redirect("/profile")
})

function isLoggedIn(req, res, next) {
  if (req.cookies.token==="") {
    res.redirect("/login");
  } else {
      let data = jwt.verify(req.cookies.token, "secretkeypassing");
      req.user = data;
      next();
  
}
}

app.listen(port);
