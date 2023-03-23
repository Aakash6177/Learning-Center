var express = require('express');
var app = express();
//Importing Functions
const tc = require("./tutorialCenter/tc.js");
const si = require("./supplementalInstruction/si.js");
const asc = require("./academicSuccessCoaching/asc.js");


//Endpoint Tutorial Center
app.get('/tc', function(req,res){
    //Returns the home screen for Tutorial Center
    tc.homeScreen(req,res);
});
//Endpoint Supplemental Instruction
app.get('/si', function(req,res){
    //Returns the home screen for Supplemental Instruction
    si.homeScreen(req,res);
});
//Endppoint Acedemic Success Coaching
app.get('/asc', function(req,res){
    //Returns the home screen for Acedemic Success Coaching
    asc.homeScreen(req,res);
});
app.post('/asc/appointment' function(req,res){
    //fucntion call to handle form submisson goes here
    res.end();
});

//Running Server
var server = app.listen(8008, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
});
