const db = require("../models")
const Task = db.tasks

// Create and Save a new Task
exports.createTask = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" })
    return
  }

  // Create a Task
  const task = new Task({
    id: req.body.id,
    title: req.body.title,
    note: req.body.note,
    creationDate: req.body.creationDate,
    lastEdit: req.body.lastEdit,
    users: req.body.users
  })

  // Save Task in the database
  task
    .save(task)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Task."
      })
    })
}

// Retrieve all Tasks from the database.
exports.findAllTasks = (req, res) => {
  const title = req.query.title
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {}

  Task.find(condition)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks."
      })
    })
}

// Find a single Task with an id
exports.findOneTask = (req, res) => {
  const id = req.params.id

  Task.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Task with id: " + id })
      else res.send(data)
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: err.message || "Error retrieving Task with id: " + id })
    })
}

// Update a Task by the id in the request
exports.updateTask = async (req, res) => {
  const id = req.body.id

  // Cerca l'immagine basata sul userId
  const existingTask = await Task.findById(id)
  console.log('---------------DATI PER UPDATE---------------')
  console.log(req.body)
  console.log('---------------TASK SU CUI FARE L\'UPDATE---------------')
  console.log(existingTask)


  if (!existingTask) {
    return res.status(404).send({
      message: "Image not found for the specified user ID.",
    })
  }

  existingTask.title = req.body.title
  existingTask.note = req.body.note
  existingTask.creationDate = req.body.creationDate
  existingTask.lastEdit = req.body.lastEdit
  existingTask.users[0] = req.body.users[0]

  await existingTask.save()
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

// Delete a Task with the specified id in the request
exports.deleteTask = (req, res) => {
  const id = req.params.id

  Task.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Task with id:${id}. Maybe Task was not found!`
        })
      } else {
        res.send({
          message: "Task was deleted successfully!"
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Could not delete Task with id: " + id
      })
    })
}

// Delete all Task from the database.
exports.deleteAllTasks = (req, res) => {
  Task.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tasks were deleted successfully!`
      })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tasks."
      })
    })
}
