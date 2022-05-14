const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: "string",
    require: [true, "USer must have username"],
    unique: true,
  },
  password: {
    type: "string",
    require: [true, "Password must be exist"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
