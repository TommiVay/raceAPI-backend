const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const driversRouter = require('./controllers/drivers')
const loginRouter = require('./controllers/login')
const sessionsRouter = require('./controllers/sessions')
const tracksRouter = require('./controllers/tracks')
const vehiclesRouter = require('./controllers/vehicles')
const lapsRouter = require('./controllers/laps')

mongoose.connect(`mongodb+srv://pakedi:1234@cluster0-aokec.mongodb.net/ralliPinta?retryWrites=true&w=majority`, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

app.use('/api/drivers', driversRouter)
app.use('/api/login', loginRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/tracks', tracksRouter)
app.use('/api/vehicles', vehiclesRouter)
app.use('/api/laps', lapsRouter)

module.exports = app