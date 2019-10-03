const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const lapSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    track: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        required: true
    },
    time: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    }
})

lapSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Lap = mongoose.model('Lap', lapSchema)

module.exports = Lap