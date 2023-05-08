const express = require('express');
const app = express();
app.use(express.json()) //Parse the Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const { connectToDb, getDb } = require('./database.js')
const { spawn } = require('child_process')
const template = require("../Tutor Template/tutor_template.json")
const homeTemplate = require("../Tutor Template/TutorClassCardSelection.json")

//Database connection
let db
connectToDb((err) => {
    if (!err) { //If no errors, continue to connect to db
        app.listen(4000, () => {
            console.log("Listening to Port 4000...")
        }); //Listen to port 4000
        db = getDb()
    }
})


const scraper = 'scraperTutor.py'
const dailyScraper = 'scraperTutorStatus.py'
function runScraper() {
    spawn('python3', [scraper]) //Call Scraper --> Will by python3 instead of py in cloud
    let tutorData = require('./tutorData.json')

    db.collection('tutors')
        .deleteMany({})
        .then(() => {
            console.log("Delete Success");
            db.collection('tutors')
                .insertMany(tutorData)
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

}

function runDailyScraper() {
    spawn('python3', [dailyScraper]) //Call Scraper --> Will by python3 instead of py in cloud
    let tutorDailyData = require('./tutorDailyData.json')

    db.collection('tutorsDaily')
        .deleteMany({})
        .then(() => {
            console.log("Daily Delete Success");
            db.collection('tutorsDaily')
                .insertMany(tutorDailyData)
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


//CRUD and Routes
app.get('/tutors', (req, res) => { //Find tutors
    let tutors = [] //Storing all the data into here
    db.collection('tutors') //Get the collection from mongo
        .find() //Get all the data -> fetches as a json file | Is actually a "Cursor" -> Use toArray or forEach
        .sort({ Subject: 1, Tutor: 1 }) //Sort by subject and name
        .forEach(tutor => tutors.push(tutor)) //Fill the Tutor array
        .then(() => {
            res.status(200).json(homeTemplate); //If all good, send back the tutors
        })
        .catch(error => {
            res.status(500).json({ Error: error })
        })
})

app.get('/tutors/:Subject', (req, res) => { //Find specific tutors
    let tutors = []
    db.collection('tutors')
        .find({ Subject: req.params.Subject })
        .sort({ Tutor: 1 })
        .forEach(tutor => tutors.push(tutor)) //
        .then(() => {
            let status = require("./tutorDailyData.json");
            template.content[0].items.length = 0;
            template.content[0].heading.heading = "Tutoring: " + req.params.Subject;
            for (i = 0; i < tutors.length; i++) {
                let tutorStatus = status.find(stat => stat["Tutor Name"] === tutors[i]["Tutor Name"])
                let statusOnOff;
                if (tutorStatus.Status == "Out") { //"../Tutor Custom Images/off.png"
                    statusOnOff = "https://emojis.wiki/thumbs/emojis/red-circle.webp"
                }
                else { //"../Tutor Custom Images/on.png"
                    statusOnOff = "https://emojis.wiki/thumbs/emojis/green-circle.webp"
                }
                if (tutors[i]["Specializations"] == "" || typeof (tutors[i]["Specializations"]) == null) {
                    template.content[0].items.push(
                        {
                            "title": "Tutor: " + tutors[i]["Tutor Name"],
                            "description": "<strong>Primary Courses:</strong> <br>" + tutors[i]["Primary Courses"] + "<br><br>"
                                + "<strong>Secondary Courses:</strong> <br>" + tutors[i]["Secondary Courses"] + "<br><br>"
                                + "<strong>Schedule:</strong> <br>"
                                + "MON: " + tutors[i]["Monday"] + "<br>"
                                + "TUE: " + tutors[i]["Tuesday"] + "<br>"
                                + "WED: " + tutors[i]["Wednesday"] + "<br>"
                                + "THU: " + tutors[i]["Thursday"] + "<br>"
                                + "FRI: " + tutors[i]["Friday"] + "<br>",
                            "imageHorizontalPosition": "right",
                            "imageVerticalPosition": "top",
                            "imageBorderRadius": "full",
                            "imageStyle": "thumbnailSmall",
                            "image": {
                                "size": "small",
                                "url": statusOnOff,
                                "alt": tutors[i]["Tutor Name"]
                            }
                        }
                    )
                }
                else {
                    template.content[0].items.push(
                        {
                            "title": "Tutor: " + tutors[i]["Tutor Name"],
                            "description": "<strong>Specializations:</strong> " + tutors[i]["Specializations"] + "<br><br>"
                                + "<strong>Primary Courses:</strong> <br>" + tutors[i]["Primary Courses"] + "<br><br>"
                                + "<strong>Secondary Courses:</strong> <br>" + tutors[i]["Secondary Courses"] + "<br><br>"
                                + "<strong>Schedule:</strong> <br>"
                                + "MON: " + tutors[i]["Monday"] + "<br>"
                                + "TUE: " + tutors[i]["Tuesday"] + "<br>"
                                + "WED: " + tutors[i]["Wednesday"] + "<br>"
                                + "THU: " + tutors[i]["Thursday"] + "<br>"
                                + "FRI: " + tutors[i]["Friday"] + "<br>",
                            "imageHorizontalPosition": "right",
                            "imageVerticalPosition": "top",
                            "imageBorderRadius": "full",
                            "imageStyle": "thumbnailSmall",
                            "image": {
                                "size": "small",
                                "url": statusOnOff,
                                "alt": tutors[i]["Tutor Name"]
                            }
                        }
                    )
                }
            }
            res.status(200).json(template);
        })
        .catch(error => {
            res.status(500).json({ Error: error })
        })
})

app.post('/tutors', (req, res) => {
    const tutor = req.body
    db.collection('tutors')
        .insertOne(tutor)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({ Error: error })
        })
})

app.delete('/tutors/:Tutor', (req, res) => {
    db.collection('tutors')
        .deleteOne({ Tutor: req.params.Tutor })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({ Error: error })
        })
})


app.patch('/tutors/:Tutor', (req, res) => {
    const tutorUpdate = req.body
    db.collection('tutors')
        .updateOne({ Tutor: req.params.Tutor }, { $set: tutorUpdate })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({ Error: error })
        })
})



const interval = 5 * 60 * 1000
setInterval(runScraper, interval);
setInterval(runDailyScraper, interval);

//npm install mongodb --save --> Connects to mongo db