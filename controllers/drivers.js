const driversRouter = require('express').Router()
const bcyrpt = require('bcrypt')
const Driver = require('../models/driver')

driversRouter.post('/', async (request, response) => {
    const body = request.body
    if (body.password === undefined) {
        return response.status(400).json({ error: 'password missing' })
    }
    
    try {
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
        console.log(exception)
    }
})

driversRouter.get('/', async (request, response) => {
    let drivers = await Driver.find({})
    .populate('sessions', {name: 1, startDate:1, endDate:1})
    .populate('vehicles',{name:1, class:1})

    if(request.query.username){
        drivers = drivers.filter(d => d.username.toLowerCase() === request.query.username.toLowerCase())
    }
    if(request.query.vehicle){
        drivers = drivers.filter(d => d.vehicles.map(v => v.name.toLowerCase()).includes(request.query.vehicle.toLowerCase()))
    }
    if(request.query.session){
        drivers = drivers.filter(d => d.sessions.map(s => s.name.to()).includes(request.query.session.toLowerCase()))
    }
    if(request.query.name){
        drivers = drivers.filter(d => d.name.toLowerCase() === request.query.name.toLowerCase())
    }
    if(request.query.nationality){
        drivers = drivers.filter(d => d.nationality.toLowerCase() === request.query.nationality.toLowerCase())
    }
    if(request.query.organization){
        drivers = drivers.filter(d => d.organization.toLowerCase() === request.query.organization.toLowerCase())
    }

    response.json(drivers.map(d => d.toJSON()))
})

driversRouter.put('/', async (request, response) => {
    const body = request.body
    const driverToUpdate = Driver.findById(request.params.id)
    const driver = new Driver({
        organization: body.organization === undefined ? driverToUpdate.organization : body.organization,
        sessions: body.sessions === undefined ? driverToUpdate.sessions : body.sessions,
        nationality: body.nationality === undefined ? driverToUpdate.nationality : body.nationality,
        vehicles: body.vehicles === undefined ? driverToUpdate.vehicles : body.vehicles,
        passwordHash, // update tällekkin
    })

    try {
        const updatedBlog = await updatedBlog.findByIdAndUptade(request.params.id, driver, { new: true })
        response.json(updatedBlog.toJSON())
    } catch (exception) {
        console.log('APUA')
    }
})

driversRouter.delete('/:id', async (request, response) => {
    //token validointi tänne?
    try {
        const driver = await Driver.findByIdAndRemove(request.params.id)

    } catch (exception) {
        console.log('drivers delete virhe')
    }
})

module.exports = driversRouter

