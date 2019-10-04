const sessionsRouter = require('express').Router()
const Session = require('../models/session')
const Track = require('../models/track')

sessionsRouter.get('/', async (request, response) => {
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
        if(request.query.driver){
            sessions = sessions.filter(s => s.drivers.map(d => d.name.toLowerCase()).includes(request.query.driver.toLowerCase()))
        }
        if(request.query.track){
            sessions = sessions.filter(s => s.track.name.toLowerCase() === request.query.track.toLowerCase())
        }
        



        response.json(sessions.map(s => s.toJSON()))
    } catch (exception) {
        console.log('sessionrouter get virhe')
    }
})

sessionsRouter.post('/', async (request, response) => {
    const body = request.body

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
        console.log('sessionrouter post virhe')
        console.log(exception);
    }
})

sessionsRouter.delete('/:id', async (request, response) => {
    try {
        await Session.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log('sessionRouter delete virhe')
    }
})

sessionsRouter.put('/:id', async (request, response) => {
    const body = request.body
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
        console.log('sessionRouter put virhe')
    }
})

module.exports = sessionsRouter