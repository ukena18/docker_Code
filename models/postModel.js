const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: "string",
    required: [true, "Post must have title"],
  },
  body: {
    type: "string",
    required: [true, "Post must have body"],
  },
});

const Post = mongoose.model("POST", postSchema);
module.exports = Post;
