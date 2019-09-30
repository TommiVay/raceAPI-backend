const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
    },
    organization: {
        type: String,
    },
    session: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }],
    passwordHash: {
        type: String,
        required: true

    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    vehicle: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }]
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