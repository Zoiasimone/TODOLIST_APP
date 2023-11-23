const express = require("express")
const taskRoutes = require("./routes/tasks.routes")
const userRoutes = require("./routes/user.routes")
const imageRoutes = require("./routes/image.routes")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("./models")

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!")
    const app = express()

    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`)

      app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
      })
      app.use(cors())

      // parse requests of content-type - application/json
      app.use(bodyParser.json())

      // parse requests of content-type - application/x-www-form-urlencoded
      app.use(bodyParser.urlencoded({ extended: true }))

      // simple route
      app.get("/", (req, res) => {
        res.json({ message: "ToDoList Server!" })
      })

      require('./routes/auth.routes')(app)
      app.use("/api", taskRoutes)
      app.use("/api", userRoutes)
      app.use("/api", imageRoutes)

    })
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err)
    process.exit()
  })
