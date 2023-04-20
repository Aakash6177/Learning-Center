//Connect and return the database
const {MongoClient} = require('mongodb'); // Connects to Mongo
let dbConnection
let uri = "mongodb+srv://ey539629:xQxZQFrTNfv9qzfa@cluster0.wtu69ka.mongodb.net/?retryWrites=true&w=majority";
//"mongodb+srv://ey539629:xQxZQFrTNfv9qzfa@cluster0.wtu69ka.mongodb.net/?retryWrites=true&w=majority"
module.exports = {
    connectToDb: (callBack) => { //Run callback function after the connection
        MongoClient.connect(uri) // Connection to a "url" | This is local
        .then((client) => {
            dbConnection = client.db('Tutors') //Promise that will return the database
            return callBack()
        })
        .catch(err => { //Catch errors
            console.log(err)
            return callBack(err)
        })
    }, //Get Database

    getDb: () => dbConnection //Return Database only after the promise
}