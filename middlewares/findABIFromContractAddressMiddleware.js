const fetch = require('node-fetch')

async function findABIFromContractAddressMiddleware(req, res, next){
    const contractAddress = req.body.contractAddress ? req.body.contractAddress : process.env.DEFAULT_CONTRACT_ADDRESS
    const etherscanGetAbiApiUrl = `${process.env.ETHERSCAN_GET_ABI_API_URL}${contractAddress}`
    const contractAbi = await fetch(etherscanGetAbiApiUrl)
    const ABIData = await contractAbi.json()
    res.locals.ABI = JSON.parse(ABIData.result)
    console.log(res.locals.ABI)
    next()
}

exports.findABIFromContractAddressMiddleware = findABIFromContractAddressMiddleware;
