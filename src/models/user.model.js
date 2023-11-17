const mongoose = require("mongoose")

var schema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  image: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
})

const User = mongoose.model("User", schema)
module.exports = User
