const express = require('express'); // Use express
const app = express(); // the variable app will do all the express things
const http = require('http');
app.use(express.json()); //Format in Json
const bodyParser = require('body-parser'); // Parses the requests when we need to
app.use(bodyParser.json()); // read Json files
const template = require("../Home Template/HomePage_Template.json");


const tc = 'http://localhost:8080';
const asc = 'http://localhost:8080';
const si = 'http://localhost:8080';

app.get('/Home', (req, res) => {
    try {
        res.status(200).json(template)
    } catch (error) {
        res.status(500).json({Error: error})
    }
});

app.use('/si', (req, res) => {
    // Create a new request to the target microservice
    const proxyReq = http.request(
      {
        host: 'si',
        port: 3000,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        // Forward the response from the target microservice to the client
        res.status(proxyRes.statusCode);
        res.set(proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
  
    // Forward the request body to the target microservice
    req.pipe(proxyReq);
 });
app.use('/tc', (req, res) => {
    // Create a new request to the target microservice
    const proxyReq = http.request(
      {
        host: 'tc',
        port: 4000,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        // Forward the response from the target microservice to the client
        res.status(proxyRes.statusCode);
        res.set(proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
  
    // Forward the request body to the target microservice
    req.pipe(proxyReq);
 });
app.use('/asc', (req, res) => {
    // Create a new request to the target microservice
    const proxyReq = http.request(
      {
        host: 'asc',
        port: 5000,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        // Forward the response from the target microservice to the client
        res.status(proxyRes.statusCode);
        res.set(proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
  
    // Forward the request body to the target microservice
    req.pipe(proxyReq);
 });

app.listen(2000, () => {
    console.log("Listening to Port 2000...")
})
