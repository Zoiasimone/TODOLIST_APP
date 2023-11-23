const users = require("../controllers/user.controller")
const express = require("express")
var router = express.Router()


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.get("/", users.allAccess)
}

router.get("/users", users.findAll)

router.get("/users/:id", users.findUser)

router.put("/users/:id", users.saveImageForUser)

module.exports = router