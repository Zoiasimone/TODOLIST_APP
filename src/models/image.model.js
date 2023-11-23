const mongoose = require("mongoose")

var schema = mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String
})

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const Image = mongoose.model("Image", schema)
module.exports = Image
