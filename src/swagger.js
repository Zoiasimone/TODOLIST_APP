const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    title: 'TO-DO-LIST API',
    description: 'List of TO-DO-LIST routes'
  },
  host: 'localhost:8080/api'
};

const outputFile = './swagger-output.json'
const routes = ['src/routes/tasks.routes.js']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)