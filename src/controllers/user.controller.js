const db = require("../models")
const User = db.user

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content")
}

exports.saveImageForUser = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    })
  }

  const id = req.params.id

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot upload image for user with id:${id}. Maybe user was not found!`
        })
      } else res.send({ message: "User image was uploaded successfully" })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error uploaded image for User with id: " + id
      })
    })
}

exports.findUser = (req, res) => {
  const id = req.params.id

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id: " + id })
      else res.send(data)
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: err.message || "Error retrieving User with id: " + id })
    })
}

exports.findAll = (req, res) => {
  const username = req.query.username
  var condition = username ? { title: { $regex: new RegExp(username), $options: "i" } } : {}

  User.find(condition)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks"
      })
    })
}
