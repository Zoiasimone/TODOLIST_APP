const mongoose = require("mongoose")

var schema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  image: String,
  roles: [
    {
      type: String,
      ref: "Role"
    }
  ]
})

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const User = mongoose.model("User", schema)
module.exports = User
