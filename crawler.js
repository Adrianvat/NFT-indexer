const fetch = require('node-fetch')
const Web3 = require('web3')
const {getDatabaseRepository} = require('./databaseRepository')
const uuid = require('uuid')

async function startCrawler(req){
    beginCrawling(req.body)
    return await createJobInDatabase()
}

async function beginCrawling(reqBody){
    try{
        const databaseRepository = getDatabaseRepository()
        const contractAddress = await getContratAddressFromRequestBody(reqBody)
        const ABI = await findABIFromContractAddress(contractAddress)
        const smartContractObject = await createSmartContractObject(ABI, contractAddress)
        await crawlTokens(smartContractObject)
        await databaseRepository.updateJobStatus('Done')
    }
    catch(error){
        console.log(error)
        await databaseRepository.updateJobStatus('Failed')
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

async function crawlTokens(contractObject){
    for await(const tokenMetada of getTokensMetadata(contractObject)){
        await saveTokenMetadataToDB(tokenMetada)
    }
}

async function* getTokensMetadata(contractObject){
    for(let i = 0; i <= 10; i++){
        const tokenID = await contractObject.methods.tokenByIndex(i).call()
        const tokenURI = await contractObject.methods.tokenURI(tokenID).call()
        const tokenMetada = await fetch(tokenURI)
        yield await tokenMetada.json()
    }
}

async function saveTokenMetadataToDB(tokenMetadata){
    const databaseRepository = getDatabaseRepository()
    await databaseRepository.storeTokenMetadata(tokenMetadata)
}  

async function createJobInDatabase(){
    try{
        const jobId = uuid.v4()
        const databaseRepository = getDatabaseRepository()
        await databaseRepository.createJob(jobId)
        return jobId
    }
    catch(error){
        console.log(error)
    }
}

exports.startCrawler = startCrawler