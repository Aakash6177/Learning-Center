
//Connection to our Database
const {MongoClient} = require('mongodb'); //Using MongoDB
let dbConnection
let uri = "mongodb+srv://ey539629:xQxZQFrTNfv9qzfa@cluster0.wtu69ka.mongodb.net/?retryWrites=true&w=majority"
module.exports = {
    connectToDb: (cb) => { //Create the connection and promise to do so -> This is a callback
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db('ASC_Coaches') //This will connect to the specific cluster
            return cb()
        })
        .catch(error => {
            console.log(error)
            return cb(error)
        })
    },
    getDb: () => dbConnection //Return the database
}
