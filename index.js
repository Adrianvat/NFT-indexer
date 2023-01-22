const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const { startCrawler } = require('./crawler')

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/crawler', async (req, res) => {
    const jobId = await startCrawler(req)

    res.send(jobId)
})

app.get('/crawler/:jobId', (req, res) => {

})

app.get('contract/:address/:tokenId', (req, res) => {

})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})