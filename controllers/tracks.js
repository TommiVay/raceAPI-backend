const tracksRouter = require('express').Router()
const Track = require('../models/track')

tracksRouter.get('/', async (request, response) => {
    let tracks = await Track.find({}).populate('sessions', {name: 1, startDate:1, endDate:1})
    
    if(request.query.name){
        tracks = tracks.filter(t => t.name.toLowerCase() === request.query.name.toLowerCase())
    }
    if(request.query.address){
        tracks = tracks.filter(t => t.address.toLowerCase() === request.query.address.toLowerCase())
    }
    if(request.query.session){
        tracks = tracks.filter(t => t.sessions.map(s => s.name.toLowerCase()).includes(request.query.session.toLowerCase()))
    }
    response.json(tracks.map(t=>t.toJSON()))
})

tracksRouter.post('/', async (request, response) => {
    const body = request.body

    if(body.name === undefined
        || body.address === undefined){
            return response.status(400).json({ error: 'some properties are missing' })
        }

    try{
        const track = new Track({
            name: body.name,
            map: body.map,
            address: body.address,
            sessions: body.sessions
        })

        const savedTrack = await track.save()
        response.json(savedTrack.toJSON())
    }catch(exception){
        console.log('tracksRouter post virhe')
    }
})

tracksRouter.delete('/:id', async (request, response) =>{
    try{
        await Track.findByIdAndRemove(request.params.id)
    }catch(exception){
        console.log('tracksRouter delete virhe')
    }
})

tracksRouter.put('/:id', async (request, response) => {
    const body = request.body
    const track = {
        name: body.name,
        map: body.map,
        address: body.address,
        sessions: body.sessions
    }
    try{
        const updatedTrack = await Track.findByIdAndUpdate(request.params.id, track, {new: true})
        response.json(updatedTrack.toJSON())
    }catch(exception){
        console.log('tracksRouter put virhe')
    }
})

module.exports = tracksRouter