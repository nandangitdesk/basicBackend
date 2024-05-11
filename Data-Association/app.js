const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/create", async (req, res) => {
  let user = await userModel.create({
    username: "nandan",
    email: "nandan30@email.com",
    age: 20,
  });

  res.send(user);
});

app.get("/post/create", async (req, res) => {
  let post = await postModel.create({
    postData: "Sample post data",
    user: "662fe5097fe43faa45253250"
  });

  let user = await userModel.findOne({ _id: "662fe5097fe43faa45253250" });
  user.posts.push(post._id);
  await user.save();

  res.send({ post, user });
});

app.listen(3000);
