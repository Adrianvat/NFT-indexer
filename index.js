const express = require('express')
const app = express()
require('dotenv').config()

app.post('/crawler', (req, res) => {

})

app.get('/crawler/:jobId', (req, res) => {

})

app.get('contract/:address/:tokenId', (req, res) => {
    
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})