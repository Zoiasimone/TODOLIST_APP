//const { authJwt } = require("../middlewares")
const controller = require("../controllers/user.controller")
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

  app.get("/", controller.allAccess)

  //app.get("/user", [authJwt.verifyToken], controller.userBoard)

  //app.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard)
}

router.get("/users/:id", controller.findUser)

router.put("/users/:id", controller.saveImage)

module.exports = router