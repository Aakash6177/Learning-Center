const express = require('express'); // Use express
const app = express(); // the variable app will do all the express things
app.use(express.json()); //Format in Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const {connectToDb, getDb} = require('./database')

//Connect to Database
let db
connectToDb((error) => {
    if(!error){
        app.listen(3000, () => {
            console.log("Listening to Port 3000...")
        })
        db = getDb()
    }
})
//End of Database connection

//Get the user's data
app.get('/Coaches', (req, res) => {
    let coaches = []; // This is what we'll be storing the coaches in
    db.collection('Coaches') //Get the database
        .find() //Get everyone
        .sort({"Coach Name": 1})
        .forEach(coach => coaches.push(coach))
        .then(() => {
            res.status(200).json(coaches)
        })
        .catch((error) => {
            res.status(500).json({Error: error.message})
        })
});

app.get('/Coaches/:Name', (req, res) => {
    db.collection('Coaches') //Get the database
        .findOne({"Coach Name": req.params.Name}) //Get One person
        .then(doc => {
            res.status(200).json(doc) //doc is the person's data
        })
        .catch((error) => {
            res.status(500).json({Error: error.message})
        })
});

app.post('/Coaches', (req, res) => {
    const coach = req.body
    db.collection('Coaches')
        .insertMany(coach)
        .then(result => {
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(500).json({Error: error.message})
        })
});


app.delete('/Coaches/:Name', (req, res) => {
    db.collection('Coaches')
        .deleteOne({"Coach Name": req.params.Name})
        .then(result => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(500).json({Error: error.message})
        })
});

app.patch('/Coaches/:Name', (req,res) => {
    const coachUpdate = req.body
    db.collection('Coaches')
        .updateOne({"Coach Name": req.params.Name}, {$set: coachUpdate})
        .then(result => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(500).json({Error: error.message})
        })
})
