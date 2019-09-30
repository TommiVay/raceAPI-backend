const app = require('./app') 
const http = require('http')
const config = require('./utils/config')

const server = http.createServer(app)

server.listen(3003, () => {
  console.log(`Server running on port 3003`)
})