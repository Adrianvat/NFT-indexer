const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const { startCrawler } = require('./crawler')
const { getDatabaseRepository } = require('./databaseRepository')
const { getProgress } = require('./progressTracker')

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/crawler', async (req, res) => {
    try{
        const jobId = await startCrawler(req)
        res.send(jobId)
    }
    catch(error){
        res.status(500).send(error)
    }
})

app.get('/crawler/:jobId', async (req, res) => {
    try{
        const databaseRepository = await getDatabaseRepository()
        const job = await databaseRepository.getJob(req.params.jobId)
        res.json({
            ...job[0][0],
            progress: getProgress(req.params.jobId)
        })
    }
    catch(error){
        res.status(500).send(error)
    }
})

app.get('/contract/:contractAddress/:tokenId', async (req, res) => {
    try{
        const databaseRepository = await getDatabaseRepository()
        const metadata = await databaseRepository.getTokenMetadata(req.params.contractAddress, req.params.tokenId)
        res.json(metadata)
    }
    catch(error){
        res.status(500).send(error)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})