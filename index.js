'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  app = express().use(bodyParser.json()); // creates express http server

// grab heroku config vars
const global_verify_token = process.env.FB_VERIFY_TOKEN;
const global_access_token = process.env.FB_ACCESS_TOKEN;

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(entry => {
        const pageID = entry.id;
        const timeOfEvent = event.time;
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        console.log(entry);
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === global_verify_token) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
        
        } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
        }
    }
});

app.listen(process.env.PORT || 1337, () => console.log('Webhook listening...'));