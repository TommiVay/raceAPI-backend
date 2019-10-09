const sessionsRouter = require('express').Router()
const Session = require('../models/session')
const Track = require('../models/track')
const Lap = require('../models/lap')
const jwt = require('jsonwebtoken')
sessionsRouter.get('/', async (request, response, next) => {
    try {
        let sessions = await Session.find({})
            .populate('track', { name: 1, address: 1 })
            .populate('laps', { driver: 1, time: 1, vehicle: 1 })
            .populate('vehicles', { name: 1 })
            .populate('drivers', { name: 1, username: 1 })


        if (request.query.name) {
            sessions = sessions.filter(s => s.name.toLowerCase() === request.query.name.toLowerCase())
        }
        if (request.query.vehicle) {
            sessions = sessions.filter(s => s.vehicles.map(v => v.name.toLowerCase()).includes(request.query.vehicle.toLowerCase()))
        }
        if (request.query.driver) {
            sessions = sessions.filter(s => s.drivers.map(d => d.name.toLowerCase()).includes(request.query.driver.toLowerCase()))
        }
        if (request.query.track) {
            sessions = sessions.filter(s => s.track.name.toLowerCase() === request.query.track.toLowerCase())
        }
        if(request.query.id) {
            sessions = sessions.filter(s => s.id === request.query.id)
        }




        response.json(sessions.map(s => s.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

sessionsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.name === undefined
        || body.track === undefined
        || body.startDate === undefined
        || body.endDate === undefined) {
        return response.status(400).json({ error: 'some properties are missing' })
    }

    try {
        const track = await Track.findById(body.track)


        const session = new Session({
            name: body.name,
            drivers: body.drivers,
            vehicles: body.vehicles,
            track: track._id,
            laps: body.laps,
            startDate: body.startDate,
            endDate: body.endDate
        })
        const savedSession = await session.save()
        track.sessions = track.sessions.concat(savedSession._id)
        await track.save()
        response.json(savedSession.toJSON())

    } catch (exception) {
        next(exception)
    }
})

sessionsRouter.delete('/:id', async (request, response, next) => {
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        session = await Session.findById(request.params.id)
        let laps = await Lap.find({}).populate('session', {name: 1})
        laps = laps.filter(l => l.session.name === session.name)
        console.log(laps)
        laps.forEach(async l => 
              await Lap.findByIdAndRemove(l._id)
        )
        await Session.findByIdAndRemove(session._id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

sessionsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const sessionToUpdate = await Session.findById(request.params.id)
    const session = {
        name: body.name === undefined ? sessionToUpdate.name : body.name,
        drivers: body.drivers === undefined ? sessionToUpdate.drivers : sessionToUpdate.drivers.concat(body.drivers),
        vehicles: body.vehicles === undefined ? sessionToUpdate.vehicles : sessionToUpdate.vehicles.concat(body.vehicles),
        track: body.track === undefined ? sessionToUpdate.track : body.track,
        laps: body.laps === undefined ? sessionToUpdate.laps : sessionToUpdate.laps.concat(body.laps),
        startDate: body.startDate === undefined ? sessionToUpdate.startDate : body.startDate,
        endDate: body.endDate === undefined ? sessionToUpdate.endDate : body.endDate
    }
    try {
        const updatedSession = await Session.findByIdAndUpdate(request.params.id, session, { new: true })
        response.json(updatedSession.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = sessionsRouter