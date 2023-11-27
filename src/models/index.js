const dbConfig = require("../config/db.config.js")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.tasks = require("./tasks.model")
db.user = require("./user.model")
db.role = require("./role.model")
db.images = require("./image.model")

db.ROLES = ["user", "admin"]

module.exports = db