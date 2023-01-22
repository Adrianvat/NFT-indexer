var mysql = require('mysql2');

let connection

async function getDatabaseRepository(){
    if(!connection) connection = await connectToDb()

    return {
        storeTokenMetadata,
        createJob,
        updateJobStatus
    }

    async function storeTokenMetadata(metadata){
        console.log(metadata.image_url)
        metadata.description = metadata.description.replace(/'/g, "\\'")
        console.log(metadata.description)

        await connection.promise().query(`REPLACE INTO tokensMetadata (id, imageUrl, externalUrl, name, description, animationUrl, iframeUrl) VALUES(${metadata.id}, '${metadata.image_url}', '${metadata.external_url}', '${metadata.name}', '${metadata.description}', '${metadata.animation_url}', '${metadata.iframe_url}');`)
    }

    async function createJob(jobId){
        
        await connection.promise().query(`INSERT INTO jobs (jobId, status) VALUES('${jobId}', 'In Progress');`)
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