const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const driverRouter = require('./controllers/drivers')


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

app.use('/api/drivers', driverRouter)

module.exports = app