var mysql = require('mysql2');

let connection

async function getDatabaseRepository(){
    if(!connection) connection = await connectToDb()

    return {
        upsertTokenMetadata,
        createJob,
        updateJobStatus,
        getJob,
        getTokenMetadata
    }

    async function upsertTokenMetadata(metadata){
        metadata.description = metadata.description.replace(/'/g, "\\'")
        await connection.promise().query(`REPLACE INTO tokensMetadata (id, imageUrl, externalUrl, name, description, animationUrl, iframeUrl, contractAddress) VALUES(${metadata.id}, '${metadata.image_url}', '${metadata.external_url}', '${metadata.name}', '${metadata.description}', '${metadata.animation_url}', '${metadata.iframe_url}', '${metadata.contractAddress}');`)
        await upsertTokenAttributes(metadata)
    }

    async function upsertTokenAttributes(metadata){
        const promises = metadata.attributes.map(async attribute => {
            return await connection.promise().query(`REPLACE INTO attributes (tokenId, traitType, contractAddress, value) VALUES(${metadata.id}, '${attribute.trait_type}', '${metadata.contractAddress}', '${attribute.value}');`)
        })
        await Promise.all(promises)
    }

    async function createJob(jobId){
        
        await connection.promise().query(`INSERT INTO jobs (jobId, status) VALUES('${jobId}', 'In Progress');`)
    }

    async function getJob(id){
        return await connection.promise().query(`SELECT * FROM jobs WHERE jobId = '${id}'`)
    }

    async function getTokenMetadata(contractAddress, tokenId){
        const attributes = await connection.promise().query(`SELECT * FROM attributes WHERE contractAddress = '${contractAddress}' AND tokenId = ${tokenId}`)
        console.log(attributes)
    }

    async function updateJobStatus(id, newStatus){
        await connection.promise().query(`UPDATE jobs SET status='${newStatus}' WHERE jobId='${id}'`)
    }
}

async function connectToDb(){
    return new Promise((resolve, reject) => {
        const con = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        })
        
        con.connect(function(err) {
        if (err) throw err
        console.log("Connected!")
        reject()
        })
    
        resolve(con)
    })
}

exports.getDatabaseRepository = getDatabaseRepository