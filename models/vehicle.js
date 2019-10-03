const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const vehicleSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    class: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
})

vehicleSchema.plugin(uniqueValidator)

vehicleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle