var mysql = require('mysql');

function getDatabaseRepository(){

    const connection = connectToDb()

    return {
        storeTokenMetadata
    }

    async function storeTokenMetadata(metadata){

    }
}

async function connectToDb(){
    const con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })
    
    con.connect(function(err) {
    if (err) throw err
    console.log("Connected!")
    })

    return con
}

exports.getDatabaseRepository = getDatabaseRepository