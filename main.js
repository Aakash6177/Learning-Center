var express = require('express');
var app = express();
//Importing Functions
const tc = require("./tutorialCenter/tc.js");
const si = require("./supplementalInstruction/si.js");
const asc = require("./academicSuccessCoaching/asc.js");


//Endpoint Tutorial Center
app.get('/tc', function(req,res){
    tc.homeScreen(req,res);
});
//Endpoint Supplemental Instruction
app.get('/si', function(req,res){
    si.homeScreen(req,res);
});
//Endppoint Acedemic Success Coaching
app.get('/asc', function(req,res){
    asc.homeScreen(req,res);
});

//Running Server
var server = app.listen(8008, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
});