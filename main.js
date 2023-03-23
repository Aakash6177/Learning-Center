var express = require('express');
var app = express();
//Importing Functions
const tc = require("./tutorialCenter/tc.js");

//Endpoint Tutorial Center
app.get('/tc', function(req,res){
    tc.homeScreen(req,res);
});
//Endpoint Supplemental Instruction
app.get('/si', function(req,res){
    res.end();
});
//Endppoint Acedemic Success Coaching
app.get('/asc', function(req,res){
    res.end();
});

//Running Server
var server = app.listen(8008, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
});