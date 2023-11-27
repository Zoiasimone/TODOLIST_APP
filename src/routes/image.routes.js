// const { authJwt } = require("../middlewares")
const images = require("../controllers/image.controller")
const express = require("express")
var router = express.Router()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/images", images.findAll)

router.get("/images/:userId", images.findByUserId)

router.post("/images", upload.single('image'), images.createImage)

router.put("/images", upload.single('image'), images.updateImage)

module.exports = router