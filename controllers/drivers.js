const driversRouter = require('express').Router()
const bcyrpt = require('bcrypt')
const Driver = require('../models/driver')

driversRouter.post('/', async (request, response) => {
    const body = request.body
    if(body.password === undefined){
        return response.status(400).json({error: 'password missing'})
    }
    try{    
        const saltRounds = 10
        const passwordHash = await bcyrpt.hash(body.password, saltRounds)

        const driver = new Driver({
            username: body.username,
            name: body.name,
            organisation: body.organisation,
            nationality: body.nationality,
            passwordHash,
        })

        const savedDriver = await driver.save()

        response.json(savedDriver)
    }catch(exception){
        console.log(exception)
    }
})

driversRouter.get('/', async (request, response) => {
    const drivers = await Driver.find({}).populate('')
    response.json(drivers.map(d => d.toJSON()))
})

driversRouter.put('/', async (request, response) => {
    const body = request.body

    const driver = {
        sessions: body.sessions,
        vehicles: body.vehicles
    }

    try{
        const updatedBlog = await updatedBlog.findByIdAndUptade(request.params.id, driver, {new: true})
        response.json(updatedBlog.toJSON())
    }catch (exception){
        console.log('APUA')
    }
})

module.exports = driversRouter

