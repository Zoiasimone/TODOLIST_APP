const mongoose = require("mongoose")

var schema = mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const Images = mongoose.model("Images", schema)
module.exports = Images
