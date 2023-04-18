const {MongoClient} = require('mongodb');
let dbConnection;
let uri = "mongodb+srv://ey539629:xQxZQFrTNfv9qzfa@cluster0.wtu69ka.mongodb.net/?retryWrites=true&w=majority"
//"mongodb://127.0.0.1:27017/SI"

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then(client => {
            dbConnection = client.db("SI")
            return cb()
        })
        .catch(error => {
            console.log(error)
            return cb(error)
        })
    },
    getDb: () => dbConnection
}