const lapsRouter = require('express').Router()
const Lap = require('../models/lap')
const Vehicle = require('../models/vehicle')
const Driver = require('../models/driver')
const Track = require('../models/track')
const Session = require('../models/session')
const jwt = require('jsonwebtoken')

lapsRouter.get('/', async (request, response, next) => {
    try {
        let laps = await Lap.find({})
            .populate('session', { name: 1 })
            .populate('vehicle', { name: 1, class: 1 })
            .populate('driver', { name: 1, username: 1 })
            .populate('track', { name: 1 })

        if (request.query.session) {
            laps = laps.filter(l => l.session.name.toLowerCase() === request.query.session.toLowerCase())
        }

        if (request.query.vehicle) {
            laps = laps.filter(l => l.vehicle.name.toLowerCase() === request.query.vehicle.toLowerCase())
        }

        if (request.query.driver) {
            laps = laps.filter(l => l.driver.name.toLowerCase() === request.query.driver)
        }

        response.json(laps.map(l => l.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

lapsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    try {
        if (body.session === undefined
            || body.vehicle === undefined
            || body.driver === undefined
            || body.track === undefined
            || body.time === undefined) {
            return response.status(400).json({ error: 'some properties are missing' })
        }

        const session = await Session.findById(body.session)
        const driver = await Driver.findById(body.driver)
        const vehicle = await Vehicle.findById(body.vehicle)
        const track = await Track.findById(body.track)

        const lap = new Lap({
            session: session._id,
            vehicle: vehicle._id,
            driver: driver._id,
            track: track._id,
            time: body.time,
            notes: body.notes === undefined ? "" : body.notes
        })

        const savedLap = await lap.save()
        session.laps = session.laps.concat(savedLap)

        if (!session.drivers.includes(driver._id)) {
            session.drivers = session.drivers.concat(driver)
        }

        if (!session.vehicles.includes(vehicle._id)) {
            session.vehicles = session.vehicles.concat(vehicle)
        }

        await session.save()

        if (!driver.sessions.includes(session._id)) {
            driver.sessions = driver.sessions.concat(session)
            await driver.save()

        }
        response.json(savedLap.toJSON())
    } catch (exception) {
        next(exception)
    }

})

lapsRouter.delete('/:id', async (request, response, next) => {
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    try {
        await Lap.findByIdAndRemove(request.params.id)
        response.status(200).end()
    } catch (exception) {
        next(exception)
    }
})

lapsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

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
        next(exception)
    }
})

module.exports = lapsRouter