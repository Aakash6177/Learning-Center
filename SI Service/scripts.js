const express = require('express'); // Use express
const app = express(); // the variable app will do all the express things
app.use(express.json()); //Format in Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const {connectToDb, getDb} = require('./database')
const { spawn } = require('child_process')
const template = require("../SI Template/SI_Leader_Template.json")
const homeTemplate = require("../SI Template/SI_Home.json")
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
    let siLeaders = []; // This is what we'll be storing the SI Leaders in
    db.collection('LeadersDaily') //Choose the database "Leaders"
        .find() //Get everyone
        .sort({"Subject": 1}) //Sort Alphabetically
        .forEach(leader => siLeaders.push(leader)) //Fill the array with with data
        .then(() => {
            homeTemplate.content[0].heading.description = "";
            for(i = 0; i < siLeaders.length; i++){
                homeTemplate.content[0].heading.description += "<strong>Subject:</strong> " + siLeaders[i]["Subject"] + "<br>" +
                                                               "<strong>SI Leader:</strong> " + siLeaders[i]["SI Leader"] + "<br>" +
                                                               "<strong>Notes:</strong> " + siLeaders[i]["Notes"] + "<br>"
            }
            res.status(200).json(homeTemplate) //Return All the SI Leaders in order
        })
        .catch(error => {
            res.status(500).json({Error: error}) //Return MongoDB Error on Fail
        })
});

app.get('/Leaders/:Subject', (req, res) => {
    let siLeaders = [];
    db.collection('Leaders') //Get the database
        .find({"Subject": {$regex: req.params.Subject}}) //Get One person
        .forEach(leader => siLeaders.push(leader))
        .then(() => {
            // template = JSON.parse(template);
            template.content[0].items.length = 0;
            template.content[0].heading.heading = "SI Leader: " + req.params.Subject;
            for(i = 0; i < siLeaders.length; i++){
                if(siLeaders[i]["Zoom Link"] != "NA"){
                    template.content[0].items.push(
                        {
                            "imageHorizontalPosition": "right",
                            "imageVerticalPosition": "top",
                            "title": "SI Leader: " + siLeaders[i]["SI Leader"],
                            "description": "<strong>Instructor:</strong> " + siLeaders[i]["Instructor"] + "<br>"
                                         + "<strong>Subject:</strong> " + siLeaders[i]["Subject"] + "<br><br>"
                                         + "<strong>Pronouns:</strong> " + siLeaders[i]["SI Leader"] + "<br>"
                                         + "<strong>Sessions:</strong><br>"
                                         + siLeaders[i]["Session One"] + "<br>"
                                         + siLeaders[i]["Session Two"] + "<br><br>"
                                         + "<strong>Office Hours:</strong><br>"
                                         + siLeaders[i]["Office Hour One"] + "<br>"
                                         + siLeaders[i]["Office Hour Two"] + "<br><br>"
                                         + "<strong>Zoom Link:</strong> <a href=" +  siLeaders[i]["Zoom Link"] + ">" + siLeaders[i]["Zoom Link"] + "</a>",
                            "image": {
                                "url": siLeaders[i]["Image Url"],
                                "alt": siLeaders[i]["SI Leader"]
                            }
                        }
                    )    
                }
                else{
                    template.content[0].items.push(
                        {
                            "imageHorizontalPosition": "right",
                            "imageVerticalPosition": "top",
                            "title": "SI Leader: " + siLeaders[i]["SI Leader"],
                            "description": "<strong>Instructor:</strong> " + siLeaders[i]["Instructor"] + "<br>"
                                         + "<strong>Subject:</strong> " + siLeaders[i]["Subject"] + "<br><br>"
                                         + "<strong>Pronouns:</strong> " + siLeaders[i]["SI Leader"] + "<br>"
                                         + "<strong>Sessions:</strong><br>"
                                         + siLeaders[i]["Session One"] + "<br>"
                                         + siLeaders[i]["Session Two"] + "<br><br>"
                                         + "<strong>Office Hours:</strong><br>"
                                         + siLeaders[i]["Office Hour One"] + "<br>"
                                         + siLeaders[i]["Office Hour Two"],
                            "image": {
                                "url": siLeaders[i]["Image Url"],
                                "alt": siLeaders[i]["SI Leader"]
                            }
                        }
                    ) 
                }
            }
            // console.log(template)
            //template = JSON.stringify(template)
            res.status(200).json(template) //doc is the person's data
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
});

app.post('/Leaders', (req, res) => {
    const leader = req.body
    db.collection('Leaders')
        .insertMany(leader)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
});


app.delete('/Leaders/:Name', (req, res) => {
    db.collection('Leaders')
        .deleteOne({"SI Leader": req.params.Name})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
});

app.patch('/Leaders/:Name', (req,res) => {
    const leaderUpdate = req.body
    db.collection('Leaders')
        .updateOne({"SI Leader": req.params.Name}, {$set: leaderUpdate})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json({Error: error})
        })
})


//Run the scraper every 5 mins
const interval = 5 * 60 * 1000
setInterval(runScraper, interval);