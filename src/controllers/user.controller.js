const db = require("../models")
const User = db.user

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.")
}

exports.saveImage = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    })
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot upload image for User with id:${id}. Maybe User was not found!`
        })
      } else res.send({ message: "User image was uploaded successfully." })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error uploaded image for User with id: " + id
      })
    })
}

exports.findUser = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    })
  }

  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find User with id:${id}.`
        })
      } else res.send({ message: "User found successfully." })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error find User with id: " + id
      })
    })
}
