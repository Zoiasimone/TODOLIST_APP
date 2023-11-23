
const tasks = require("../controllers/tasks.controller")
const express = require("express")
var router = express.Router()

// Create a new Task
router.post("/tasks", tasks.create)

// Retrieve all Tasks
router.get("/tasks", tasks.findAll)

// Retrieve a single Task with id
router.get("/tasks/:id", tasks.findOne)

// Update a Task with id
router.put("/tasks/:id", tasks.update)

// Delete a Task with id
router.delete("/tasks/:id", tasks.delete)

// Delete all Tasks
router.delete("/tasks", tasks.deleteAll)

module.exports = router