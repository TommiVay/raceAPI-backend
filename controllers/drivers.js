const driversRouter = require('express').Router()
const bcyrpt = require('bcrypt')
const Driver = require('../models/driver')
const Lap = require('../models/lap')
const Vehicle = require('../models/vehicle')
const jwt = require('jsonwebtoken')

driversRouter.post('/', async (request, response, next) => {
    const body = request.body

    try {

        if (body.password === undefined) {
            return response.status(400).json({ error: 'password missing' })
        }
        if (body.username === undefined) {
            return response.status(400).json({ error: 'username missing' })
        }
        if (body.name === undefined) {
            return response.status(400).json({ error: 'name missing' })
        }

        const saltRounds = 10
        const passwordHash = await bcyrpt.hash(body.password, saltRounds)

        const driver = new Driver({
            username: body.username,
            name: body.name,
            organization: body.organization === undefined ? "" : body.organization,
            sessions: body.sessions,
            nationality: body.nationality === undefined ? "" : body.nationality,
            vehicles: body.vehicles,
            passwordHash,
        })

        const savedDriver = await driver.save()
        response.json(savedDriver)
    } catch (exception) {
        next(exception)
    }
})

driversRouter.get('/', async (request, response, next) => {
    try {
        let drivers = await Driver.find({})
            .populate('sessions', { name: 1, startDate: 1, endDate: 1 })
            .populate('vehicles', { name: 1, class: 1 })

        if (request.query.username) {
            drivers = drivers.filter(d => d.username.toLowerCase() === request.query.username.toLowerCase())
        }
        if (request.query.vehicle) {
            drivers = drivers.filter(d => d.vehicles.map(v => v.name.toLowerCase()).includes(request.query.vehicle.toLowerCase()))
        }
        if (request.query.session) {
            drivers = drivers.filter(d => d.sessions.map(s => s.name.to()).includes(request.query.session.toLowerCase()))
        }
        if (request.query.name) {
            drivers = drivers.filter(d => d.name.toLowerCase() === request.query.name.toLowerCase())
        }
        if (request.query.nationality) {
            drivers = drivers.filter(d => d.nationality.toLowerCase() === request.query.nationality.toLowerCase())
        }
        if (request.query.organization) {
            drivers = drivers.filter(d => d.organization.toLowerCase() === request.query.organization.toLowerCase())
        }

        response.json(drivers.map(d => d.toJSON()))
    } catch (exception) {
        next(exception)
    }
})


driversRouter.put('/', async (request, response, next) => {
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
        const driverToUpdate = await Driver.findById(request.params.id)
        const driver = new Driver({
            organization: body.organization === undefined ? driverToUpdate.organization : body.organization,
            sessions: body.sessions === undefined ? driverToUpdate.sessions : body.sessions,
            nationality: body.nationality === undefined ? driverToUpdate.nationality : body.nationality,
            vehicles: body.vehicles === undefined ? driverToUpdate.vehicles : body.vehicles,
            passwordHash,
        })

        const updatedBlog = await updatedBlog.findByIdAndUptade(request.params.id, driver, { new: true })
        response.json(updatedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

driversRouter.delete('/:id', async (request, response, next) => {
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, "ASD")
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        const driver = await Driver.findById(request.params.id)
        console.log(driver._id)
        //poistetaan kaikki viittaukset poistettavaan kuskiin
        let laps = await Lap.find({}).populate('driver', {username: 1})
        laps = laps.filter(l => l.driver.username === driver.username)
        laps.forEach(async l => 
              await Lap.findByIdAndRemove(l._id)
        )
        driver.vehicles.forEach(async v => 
             await Vehicle.findByIdAndRemove(v)
        )
        await Driver.findByIdAndRemove(request.params.id)
        response.status(200).end()
    } catch (exception) {
        next(exception)
    }
})

module.exports = driversRouter

