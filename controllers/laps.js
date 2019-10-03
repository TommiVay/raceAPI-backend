const lapsRouter = require('express').Router()
const Lap = require('../models/lap')
const Vehicle = require('../models/vehicle')
const Driver = require('../models/driver')
const Track = require('../models/track')
const Session = require('../models/session')

lapsRouter.get('/', async (request, response) => {
    try {
        const laps = await Lap.find({})
            .populate('session', { name: 1 })
            .populate('vehicle', { name: 1, class: 1 })
            .populate('driver', { name: 1 })
            .populate('track', { name: 1 })

        response.json(laps.map(l => l.toJSON()))
    } catch (exception) {
        console.log(exception)
    }
})

lapsRouter.post('/', async (request, response) => {
    const body = request.body
    const session = await Session.findById(body.session)
    const driver = await Driver.findById(body.driver)
    const vehicle = await Vehicle.findById()

    try {
        const lap = new Lap({
            session: session._id,
            vehicle: body.vehicle,
            driver: body.driver,
            track: body.track,
            time: body.time,
            notes: body.notes
        })

        const savedLap = await lap.save()
        session.laps = session.laps.concat(savedLap)
        if(!session.drivers.includes(driver)){
            session.drivers = session.drivers.concat(driver)
        }

        if(!session.vehicles.includes(vehicle)){
            session.vehicles = session.vehicles.concat(vehicle)
        }
        await session.save()

        if (!driver.sessions.includes(session)) {
            driver.sessions = driver.sessions.concat(session)
            await driver.save()
        }



        response.json(savedLap.toJSON())
    } catch (exception) {
        console.log(exception)
    }

})

lapsRouter.delete('/:id', async (request, response) => {
    try {
        await Lap.findByIdAndRemove(request.params.id)
    } catch (exception) {
        console.log(exception)
    }
})

lapsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const lapToUpdate = await Lap.findById(request.params.id)
    const lap = {
        session: body.session === undefined ? lapToUpdate.session : body.session,
        vehicle: body.vehicle === undefined ? lapToUpdate.vehicle : body.vehicle,
        driver: body.driver === undefined ? lapToUpdate.driver : body.driver,
        track: body.track === undefined ? lapToUpdate.track : body.track,
        time: body.time === undefined ? lapToUpdate.time : body.time,
        notes: body.notes === undefined ? lapToUpdate.notes : body.notes
    }

    try {
        const updatedLap = await Lap.findByIdAndUpdate(request.params.id, lap, { new: true })
        response.json(updatedSession.toJSON())
    } catch (exception) {
        console.log(exception)
    }
})

module.exports = lapsRouter