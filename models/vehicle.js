const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const vehicleSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    class: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    }
})

driverSchema.plugin(uniqueValidator)

driverSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})
const Driver = mongoose.model('Driver', driverSchema)

module.exports = Driver