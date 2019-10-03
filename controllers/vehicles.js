const vehiclesRouter = require('express').Router()
const Vehicle = require('../models/vehicle')
const Driver = require('../models/driver')

vehiclesRouter.get('/', async (request, response) => {
    try {
        const vehicles = await Vehicle.find({}).populate('driver', {name:1})
        response.json(vehicles.map(v => v.toJSON()))
    } catch (exception) {
        console.log(expection)
    }
})

vehiclesRouter.post('/', async (request, response) => {
    const body = request.body
    try {
        const driver = await Driver.findById(body.driver)
        const vehicle = new Vehicle({
            driver: driver._id,
            class: body.class,
            name: body.name,
            description: body.description
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
