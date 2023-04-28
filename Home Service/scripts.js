const express = require('express'); // Use express
const app = express(); // the variable app will do all the express things
app.use(express.json()); //Format in Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const template = require("../Home Template/HomePage_Template.json");

app.listen(2000, () => {
    console.log("Listening to Port 2000...")
})

app.get('/Home', (req, res) => {
    try {
        res.status(200).json(template)
    } catch (error) {
        res.status(500).json({Error: error})
    }
});
