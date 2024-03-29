const mongoose = require("mongoose")

var schema = mongoose.Schema({
  title: String,
  note: String,
  creationDate: String,
  lastEdit: String,
  users: [
    {
      type: String,
      ref: "User"
    }
  ]
})

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const Task = mongoose.model("Task", schema)
module.exports = Task
