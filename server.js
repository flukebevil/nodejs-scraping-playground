'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose')
const route = require('./route')

const server = Hapi.server({
    host: 'localhost',
    port: 3000
})

const start = async function () {
    try {
        await server.start().catch(err => { console.log(err) })
        await mongoose.connect('mongodb://localhost/scrap')
        await route(server)
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
    console.log('Server running at:', server.info.uri)
}
start().catch(err => { console.log(err) })