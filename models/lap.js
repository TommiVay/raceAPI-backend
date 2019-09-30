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
        ref: 'Vehicle'
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    track: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    },
    time: {
        type: Date,
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