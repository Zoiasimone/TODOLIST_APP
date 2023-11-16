  const mongoose = require("mongoose")

  var schema = mongoose.Schema(
    {
      title: String,
      note: String,
      creationDate: String,
      lastEdit: String
    },
    { timestamps: true }
  )

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Tasks = mongoose.model("Tasks", schema)
  module.exports = Tasks
  