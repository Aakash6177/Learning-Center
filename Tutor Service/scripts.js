const express = require('express');
const app = express();
app.use(express.json()) //Parse the Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const {connectToDb, getDb} = require('./database.js')
const { spawn } = require('child_process')
const template = require("../Tutor Template/tutor_temp_template.json")

//let template = data.content[0].items;
//Database connection
let db
connectToDb((err) => {
    if(!err){ //If no errors, continue to connect to db
        app.listen(4000, () => {
            console.log("Listening to Port 4000...")
        }); //Listen to port 4000
        db = getDb()
    }
})


const scraper = 'scraperTutor.py'
const dailyScraper = 'scraperTutorStatus.py'
function runScraper(){
    spawn('py', [scraper, dailyScraper]) //Call Scraper --> Will by python3 instead of py in cloud
    console.log("Tutor Data Updated") //Tell us it updated
    let tutorData = require('./tutorData.json')
    let tutorDailyData = require('./tutorDailyData.json')

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
    //Current Page -> (Optional)
    //const page = req.query.p || 0
    //const tutorsPerPage = 5 //Only 5 Tutors per screen

    let tutors = [] //Storing all the data into here
    db.collection('tutors') //Get the collection from mongo
        .find() //Get all the data -> fetches as a json file | Is actually a "Cursor" -> Use toArray or forEach
        .sort({Subject: 1, Tutor: 1}) //Sort by subject and name
        // .skip(page * tutorsPerPage) //We are only showing this many --> Skip doesn't actually skip. Loads the next ones (Optional)
        // .limit(tutorsPerPage) // Show the 5 we want to show first (Optional)
        .forEach(tutor => tutors.push(tutor)) //Fill the Tutor array
        .then(() => {
            res.status(200).json(tutors); //If all good, send back the tutors
        })
        .catch(() => {
            res.status(500).json({error: "Could not fetch documents"})
        })
})

app.get('/tutors/:Subject', (req, res) => { //Find specific tutors
    let tutors = []
    db.collection('tutors')
        .find({Subject: req.params.Subject})
        .sort({Tutor: 1})
        .forEach(tutor => tutors.push(tutor)) //
        .then(() => {
            template.content[0].items.length = 0;
            template.content[0].heading.heading = tutors[0]["Subject"];
            for(i = 0; i < tutors.length; i++){
                if(tutors[i]["Specializations"] == "" || typeof(tutors[i]["Specializations"]) == null){
                    template.content[0].items.push(
                        {
                            "title": "SI Leader: " + tutors[i]["Tutor Name"],
                            "description": "Primary Courses: <br>" + tutors[i]["Primary Courses"] + "<br><br>"
                                         + "Secondary Courses: <br>" + tutors[i]["Secondary Courses"] + "<br><br>"
                                         + "Schedule: <br>"
                                         + "M: " + tutors[i]["Monday"] + "<br>"
                                         + "T: " + tutors[i]["Tuesday"] + "<br>"
                                         + "W: " + tutors[i]["Wednesday"] + "<br>"
                                         + "TH: " + tutors[i]["Thursday"] + "<br>"
                                         + "F: " + tutors[i]["Friday"] + "<br>"
                        }
                    )
                }
                else{
                    template.content[0].items.push(
                        {
                            "title": "SI Leader: " + tutors[i]["Tutor Name"],
                            "description": "Specializations: " + tutors[i]["Specializations"] + "<br><br>"
                                         + "Primary Courses: <br>" + tutors[i]["Primary Courses"] + "<br><br>"
                                         + "Secondary Courses: <br>" + tutors[i]["Secondary Courses"] + "<br><br>"
                                         + "Schedule: <br>"
                                         + "M: " + tutors[i]["Monday"] + "<br>"
                                         + "T: " + tutors[i]["Tuesday"] + "<br>"
                                         + "W: " + tutors[i]["Wednesday"] + "<br>"
                                         + "TH: " + tutors[i]["Thursday"] + "<br>"
                                         + "F: " + tutors[i]["Friday"] + "<br>"
                        }
                    )
                }
            }
            res.status(200).json(template);
        })
        .catch(() => {
            res.status(500).json({error: "Could not fetch document"})
        })
})

app.post('/tutors', (req, res) => {
    const tutor = req.body
    db.collection('tutors')
        .insertOne(tutor)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: "Could not create new document"})
        })
})

app.delete('/tutors/:Tutor', (req,res) => {
    db.collection('tutors')
        .deleteOne({Tutor: req.params.Tutor})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: "Could not delete document"})
        })
})


app.patch('/tutors/:Tutor', (req, res) => {
    const tutorUpdate = req.body
    db.collection('tutors')
        .updateOne({Tutor: req.params.Tutor}, {$set: tutorUpdate})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: "Could not update document"})
        })
})



const interval = 5 * 60 * 1000
setInterval(runScraper, interval);


//npm install mongodb --save --> Connects to mongo db