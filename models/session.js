const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    vehicles: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    }],
    drivers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Driver'
    }],
    track: {
        type: mongoose.Schema.ObjectId,
        ref: 'Track',
        required: true
    },
    laps: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Lap'
    }],
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    }
})

sessionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session