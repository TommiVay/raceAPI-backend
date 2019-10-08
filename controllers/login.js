const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Driver = require('../models/driver')


loginRouter.post('/', async (request, response, next) => {
    const body = request.body
    try {
        const driver = await Driver.findOne({ username: body.username })
        const passwordCorrect = driver === null
            ? false
            : await bcrypt.compare(body.password, driver.passwordHash)

        if (!(driver && passwordCorrect)) {
            return response.status(401).json({
                error: 'Invalid username or password'
            })
        }

        const driverForToken = {
            username: driver.username,
            id: driver._id
        }

        const token = jwt.sign(driverForToken, "ASD")

        response
            .status(200)
            .send({
                token,
                username: driver.username,
                name: driver.name
            })
    } catch (exception) {
        next(exception)
    }
})

module.exports = loginRouter