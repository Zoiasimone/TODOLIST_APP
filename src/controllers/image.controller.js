const db = require("../models")
const Image = db.image


exports.createImage = async (req, res) => {

  // Create an Image
  if (req.body && req.file) {

    const image = new Image({
      id: req.body.id,
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    })

    // Save Image in the database
    await image.save()
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Image."
        })
      })
  } else {
    res.send({ message: 'Request is empty' })
  }
}

exports.updateImage = (req, res) => {
  //update Image with the image created
  const id = req.params.id

  Image.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Image with id:${id}. Maybe Image was not found!`
        })
      } else res.send({ message: "Image was updated successfully." })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error updating Image with id: " + id
      })
    })
}

exports.findAll = (req, res) => {
  const id = req.query.id
  var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {}

  Image.find(condition)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving images."
      })
    })
}

// Find a single Image with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  Image.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Image with id: " + id })
      }
      else {
        res.send(data)
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: err.message || "Error retrieving Image with id: " + id })
    })
}

