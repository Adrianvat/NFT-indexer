const fetch = require('node-fetch')
const Web3 = require('web3')
const {getDatabaseRepository} = require('./databaseRepository')
const uuid = require('uuid')
const { startTracking, stopTracking, increaseCurrentProgress } = require('./progressTracker')

async function startCrawler(req){
    try{
        const jobId = await createJobInDatabase()
        beginCrawling(req.body, jobId)
        return jobId
    }
    catch(error){
        console.log(error)
        return null
    }
}

async function beginCrawling(reqBody, jobId){
    const databaseRepository = await getDatabaseRepository()

    try{
        const contractAddress = await getContratAddressFromRequestBody(reqBody)
        console.log(contractAddress)
        const ABI = await findABIFromContractAddress(contractAddress)
        const smartContractObject = await createSmartContractObject(ABI, contractAddress)
        await crawlTokens(smartContractObject, contractAddress, jobId)
        await databaseRepository.updateJobStatus(jobId, 'Done')
    }
    catch(error){
        console.log(error)
        await databaseRepository.updateJobStatus(jobId, 'Failed')
    }
}

async function findABIFromContractAddress(contractAddress){
    const etherscanGetAbiApiUrl = `${process.env.ETHERSCAN_GET_ABI_API_URL}${contractAddress}`
    const contractAbi = await fetch(etherscanGetAbiApiUrl)
    const ABIData = await contractAbi.json()
    return ABIData.result
}

async function createSmartContractObject(ABI, contractAddress){
    const web3 = new Web3(process.env.INFURA_RPC_URL)
    return new web3.eth.Contract(JSON.parse(ABI), contractAddress)
}

function getContratAddressFromRequestBody(body){
    return body.contractAddress ? body.contractAddress : process.env.DEFAULT_CONTRACT_ADDRESS
}

async function crawlTokens(contractObject, contractAddress, jobId){
    const numberOfTokens = await contractObject.methods.totalSupply().call()
    startTracking(jobId, numberOfTokens)
    for await(const tokenMetada of getTokensMetadata(contractObject, contractAddress, numberOfTokens)){
        await saveTokenMetadataToDB(tokenMetada)
        increaseCurrentProgress(jobId)
    }
    stopTracking(jobId)
}

async function* getTokensMetadata(contractObject, contractAddress, numberOfTokens){
    for(let i = 0; i <= numberOfTokens; i++){
        try{
            const tokenID = await contractObject.methods.tokenByIndex(i).call()
            const tokenURI = await contractObject.methods.tokenURI(tokenID).call()
            const data = await fetch(tokenURI)
            const tokenMetada = await data.json()
            tokenMetada.id = tokenID
            tokenMetada.contractAddress = contractAddress
            yield await tokenMetada
        }
        catch(error){
            console.log(error)
            continue
        }
    }
}

async function saveTokenMetadataToDB(tokenMetadata){
    const databaseRepository = await getDatabaseRepository()
    await databaseRepository.upsertTokenMetadata(tokenMetadata)
}  

async function createJobInDatabase(){
    try{
        const jobId = uuid.v4()
        const databaseRepository = await getDatabaseRepository()
        await databaseRepository.createJob(jobId)
        return jobId
    }
    catch(error){
        console.log(error)
    }
}

exports.startCrawler = startCrawler