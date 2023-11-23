const { authJwt } = require("../middlewares")
const images = require("../controllers/image.controller")
const express = require("express")
var router = express.Router()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })
}

router.get("/images", images.findAll)

router.get("/images/:id", images.findOne)

router.post("/images", upload.single('image'), images.createImage)

router.put("/images/:id", [authJwt.verifyToken], images.updateImage)

module.exports = router