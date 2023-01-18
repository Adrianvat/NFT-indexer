const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const {findABIFromContractAddressMiddleware} = require('./middlewares/findABIFromContractAddressMiddleware');

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/crawler', findABIFromContractAddressMiddleware, (req, res) => {
    res.send()
})

app.get('/crawler/:jobId', (req, res) => {

})

app.get('contract/:address/:tokenId', (req, res) => {

})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})