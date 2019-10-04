const vehiclesRouter = require('express').Router()
const Vehicle = require('../models/vehicle')
const Driver = require('../models/driver')

vehiclesRouter.get('/', async (request, response) => {
    try {
        let vehicles = await Vehicle.find({}).populate('driver', {name:1})
       if(request.query.driver){
           vehicles = vehicles.filter(v => v.driver.name.toLowerCase() === request.query.driver.toLowerCase() )
       }
       if(request.query.class){
           vehicles = vehicles.filter(v => v.class.toLowerCase() === request.query.class.toLowerCase())
       }
       if(request.query.name){
           vehicles = vehicles.filter(v => v.name.toLowerCase() === request.query.name.toLowerCase())
       }
        response.json(vehicles.map(v => v.toJSON()))
    } catch (exception) {
        console.log(exception)
    }
})

vehiclesRouter.post('/', async (request, response) => {
    const body = request.body
    if(body.driver === undefined || body.name === undefined){
        return response.status(400).json({ error: 'some properties are missing' })
    }
    try {
        const driver = await Driver.findById(body.driver)
        const vehicle = new Vehicle({
            driver: driver._id,
            class: body.class === undefined ? "" : body.class,
            name: body.name,
            description: body.description === undefined ? "" : body.description
        })

        const savedVehicle = await vehicle.save()
        driver.vehicles = driver.vehicles.concat(savedVehicle)
        await driver.save()
        response.json(savedVehicle.toJSON())
    } catch (exception) {
        console.log(expection)
    }
})

vehiclesRouter.delete('/:id', async (request, response) => {
    try{
        await Vehicle.findByIdAndRemove(request.params.id)
    }catch(exception){
        console.log(expection)
    }
})

vehiclesRouter.put('/:id', async (request, response) => {
    const body = request.body
    const vehicleToUpdate = await Vehicle.findById(request.params.id)

    const vehicle = {
        driver: body.driver === undefined ? vehicleToUpdate.driver : body.driver,
        class: body.class === undefined ? vehicleToUpdate.class : body.class,
        name: body.name === undefined ? vehicleToUpdate.name : body.name,
        description: body.description === undefined ? vehicleToUpdate.description : body.description
    }
    
    try{
        const updatedVehicle = await Vehicle.findByIdAndUpdate(request.params.id,vehicle, {new: true})
        response.json(updatedVehicle.toJSON())
    }catch(exception){
        console.log(expection)
    }
})

module.exports = vehiclesRouter
