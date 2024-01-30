
const tasks = require("../controllers/tasks.controller")
const express = require("express")
var router = express.Router()

//swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger-output.json')

// Create a new Task
router.post("/tasks", tasks.createTask, async function () {
  /*
    #swagger.summary = 'Create a new task'
      '@schema': {
        required: ["title", "note"]
      }
    }
  */
})

// Retrieve all Tasks
router.get("/tasks", tasks.findAllTasks, async function () {
  /*
    #swagger.summary = 'Retrieve all tasks'
  */
})

// Retrieve a single Task by id
router.get("/tasks/:id", tasks.findOneTask, async function () {
  /*
    #swagger.summary = 'Retrieve a single Task by id'

      '@schema': {
        required: ["taskId"]
      }
  */
})

// Update a Task with id
router.put("/tasks/:id", tasks.updateTask, async function () {
  /*
    #swagger.summary = 'Update a task'
 
      '@schema': {
        required: ["title", "note"]
      }
  */
})

// Delete a Task by id
router.delete("/tasks/:id", tasks.deleteTask, async function () {
  /*
    #swagger.summary = 'Delete a Task by id'
 
      '@schema': {
        required: ["taskId"],
      }
  */
})

// Delete all Tasks
router.delete("/tasks", tasks.deleteAllTasks, async function () {
  /*
    #swagger.summary = 'Delete all Tasks'
  */
})

router.use('/apidocs', swaggerUi.serve)
router.get('/apidocs', swaggerUi.setup(swaggerDocument))

module.exports = router