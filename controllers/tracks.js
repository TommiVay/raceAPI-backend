const tracksRouter = require('express').Router()
const Track = require('../models/track')
const jwt = require('jsonwebtoken')

tracksRouter.get('/', async (request, response, next) => {
    try {
        let tracks = await Track.find({}).populate('sessions', { name: 1, startDate: 1, endDate: 1 })

        if (request.query.name) {
            tracks = tracks.filter(t => t.name.toLowerCase() === request.query.name.toLowerCase())
        }
        if (request.query.address) {
            tracks = tracks.filter(t => t.address.toLowerCase() === request.query.address.toLowerCase())
        }
        if (request.query.session) {
            tracks = tracks.filter(t => t.sessions.map(s => s.name.toLowerCase()).includes(request.query.session.toLowerCase()))
        }

        response.json(tracks.map(t => t.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

tracksRouter.post('/', async (request, response, next) => {
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
        || body.address === undefined) {
        return response.status(400).json({ error: 'some properties are missing' })
    }

    try {
        const track = new Track({
            name: body.name,
            map: body.map,
            address: body.address,
            sessions: body.sessions
        })

        const savedTrack = await track.save()
        response.json(savedTrack.toJSON())
    } catch (exception) {
        next(exception)
    }
})

tracksRouter.delete('/:id', async (request, response, next) => {
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        await Track.findByIdAndRemove(request.params.id)
        response.status(200).end()
    } catch (exception) {
        next(exception)
    }
})

tracksRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const track = {
        name: body.name,
        map: body.map,
        address: body.address,
        sessions: body.sessions
    }
    try {
        const updatedTrack = await Track.findByIdAndUpdate(request.params.id, track, { new: true })
        response.json(updatedTrack.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = tracksRouter