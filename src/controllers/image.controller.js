const db = require("../models")
const mongoose = require('mongoose')
const Images = db.images

exports.createImage = async (req, res) => {

  // Create an Image
  if (req.body && req.file) {

    const { originalname, buffer, mimetype } = req.file
    const userId = req.body.userId

    const image = new Images({
      id: req.body.id,
      name: originalname,
      data: buffer,
      contentType: mimetype,
      userId: userId
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

//update Image with the image created
exports.updateImage = async (req, res) => {
  const userId = req.body.userId

  // Cerca l'immagine basata sul userId
  const existingImage = await Images.findOne({ userId: mongoose.Types.ObjectId(userId) })

  if (!existingImage) {
    return res.status(404).send({
      message: "Image not found for the specified user ID.",
    })
  }

  existingImage.name = req.file.originalname
  existingImage.data = req.file.buffer
  existingImage.contentType = req.file.mimetype

  await existingImage.save()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the Image."
      })
    })
}

exports.findAll = async (req, res) => {
  const id = req.query.id
  var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {}

  await Images.find(condition)
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

exports.findByUserId = async (req, res) => {
  const userId = req.params.userId

  // Cerca l'immagine basata sul userId
  const existingImage = await Images.findOne({ userId: mongoose.Types.ObjectId(userId) })

  if (!existingImage) {
    return res.status(404).send({
      message: "Image not found for the specified user ID.",
    })
  } else {
    return res.send(existingImage.data)
  }
}
