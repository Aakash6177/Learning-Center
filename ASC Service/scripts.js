const express = require('express'); // Use express
const app = express(); // the variable app will do all the express things
app.use(express.json()); //Format in Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const { connectToDb, getDb } = require('./database')
const { spawn } = require('child_process')
const template = require("../ASC Template/ASC_Home_V3.json")

//Connect to Database
let db
connectToDb((error) => {
    if (!error) {
        app.listen(5000, () => {
            console.log("Listening to Port 5000...")
        })
        db = getDb()
    }
})
//End of Database connection

//Call Scraper every 5 mins
const scraper = 'scraperASC.py'
function runScraper(){
    spawn('python3', [scraper]) //Call Scraper
    console.log("ASC Data Updated") //Tell us it updated
    let ascData = require('./ascData.json')

    db.collection('Coaches')
        .deleteMany({})
        .then(() => {
            console.log("Delete Success");
        })
        .catch((error) => {
            console.log("Delete Fail: ", error);
        })

    db.collection('Coaches')
        .insertMany(ascData)
        .then(() => {
            console.log("Update Success");
        })
        .catch((error) => {
            console.log("Update Fail: ", error);
        })
}
//runScraper();

//Get the user's data
app.get('/Coaches', (req, res) => {
    let coaches = []; // This is what we'll be storing the coaches in
    db.collection('Coaches') //Get the database
        .find() //Get everyone
        .sort({ "Coach Name": 1 })
        .forEach(coach => coaches.push(coach))
        .then(() => {
            res.status(200).json(template)
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
});

app.get('/Coaches/:Name', (req, res) => {
    db.collection('Coaches') //Get the database
        .findOne({ "Coach Name": req.params.Name }) //Get One person
        .then(doc => {
            res.status(200).json(doc) //doc is the person's data
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
});

app.post('/Coaches', (req, res) => {
    const coaches = req.body
    db.collection('Coaches')
        .insertMany(coaches)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
});


app.delete('/Coaches/:Name', (req, res) => {
    db.collection('Coaches')
        .deleteOne({ "Coach Name": req.params.Name })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
});

app.delete('/Coaches', (req, res) => {
    db.collection('Coaches')
        .deleteMany({})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
})

app.patch('/Coaches/:Name', (req, res) => {
    const coachUpdate = req.body
    db.collection('Coaches')
        .updateOne({ "Coach Name": req.params.Name }, { $set: coachUpdate })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
})

const interval = 5 * 60 * 1000
setInterval(runScraper, interval);