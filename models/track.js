const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const trackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    map: {
        type: Image,
    },
    address: {
        type: String,
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }
})

trackSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Track = mongoose.model('Track', trackSchema)

module.exports = Track