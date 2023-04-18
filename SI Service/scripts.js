const express = require('express'); // Use express
const app = express(); // the variable app will do all the express things
app.use(express.json()); //Format in Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const {connectToDb, getDb} = require('./database')
const { spawn } = require('child_process')

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


//Call Scraper every 5 mins
const scraper = 'scraperSI.py'
function runScraper(){
    spawn('python3', [scraper]) //Call Scraper
    console.log("SI Data Updated") //Tell us it updated
    let siData = require('./siData.json')
    let siDailyData = require('./siDailyData.json')

    db.collection('Leaders')
        .deleteMany({})
        .then(() => {
            console.log("Delete Success");
            db.collection('Leaders')
            .insertMany(siData)
            .then(() => {
                console.log("Update Success");
            })
            .catch((error) => {
                console.log("Update Fail: ", error);
            })
        })
        .catch((error) => {
            console.log("Delete Fail: ", error);
        })

    


    db.collection('LeadersDaily')
        .deleteMany({})
        .then(() => {
            console.log("Daily Delete Success: ");
            db.collection('LeadersDaily')
            .insertMany(siDailyData)
            .then(() => {
                console.log("Daily Update Success");
            })
            .catch((error) => {
                console.log("Daily Update Fail: ", error);
            })
        })
        .catch((error) => {
            console.log("Daily Delete Fail: ", error);
        })
}


//Get the user's data
app.get('/Leaders', (req, res) => {
    let siLeaders = []; // This is what we'll be storing the coaches in
    db.collection('Leaders') //Get the database
        .find() //Get everyone
        .sort({"SI Leaders": 1})
        .forEach(leader => siLeaders.push(leader))
        .then(() => {
            res.status(200).json(siLeaders)
        })
        .catch(() => {
            res.status(500).json({Error: "Could not fetch documents"})
        })
});

app.get('/Leaders/:Name', (req, res) => {
    db.collection('Leaders') //Get the database
        .findOne({"SI Leader": req.params.Name}) //Get One person
        .then(doc => {
            res.status(200).json(doc) //doc is the person's data
        })
        .catch(() => {
            res.status(500).json({Error: "Could not fetch document"})
        })
});

app.post('/Leaders', (req, res) => {
    const leader = req.body
    db.collection('Leaders')
        .insertMany(leader)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({Error: "Could not create new document"})
        })
});


app.delete('/Leaders/:Name', (req, res) => {
    db.collection('Leaders')
        .deleteOne({"SI Leader": req.params.Name})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({Error: "Could not delete document"})
        })
});

app.patch('/Leaders/:Name', (req,res) => {
    const leaderUpdate = req.body
    db.collection('Leaders')
        .updateOne({"SI Leader": req.params.Name}, {$set: leaderUpdate})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({Error: "Could not update document"})
        })
})


//Run the scraper every 5 mins
const interval = 5 * 60 * 1000
setInterval(runScraper, interval);