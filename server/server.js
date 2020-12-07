const express = require('express');
const bodyParser = require('body-parser');
var admin = require("firebase-admin");
const port = 8080;

// Configure Express to automatically decode JSON posts
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize firebase-admin
var serviceAccount = require("/var/www/html/sendbird-notify-profanity/server/firebase-auth.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Global object to store tokens in memory. In a production env this should be stored in something like Redis or Memcache
var tokens = [];

// The chat web frontend requests permission for notifications and on recieving generates a token to use to notify that instance
// It then posts this token to /api/registerToken so it can be used here to push notifications to it
app.post('/api/registerToken', (req, res) => {
    console.log('Received a token registration request');
    let token = req.body.token;
    if (tokens.indexOf(token) === -1) {
        tokens.push(token);
    }
    return res.send('OK');
});

// Handle Sendbird webhook events, this sample only handles profanity_filter:replace events, but could be easily extended to handle others
//NOTE: Request signature verification has been elided for this sample, however this should be checked in a real app
app.post('/api/sendbird', (req, res) => {
    console.log('Received a Sendbird Webhook event');
    /* 
    const body = req.body;
    const signature = req.get('x-sendbird-signature');
    const hash = crypto
        .createHmac('sha256', process.env.SENDBIRD_API_TOKEN)
        .update(body)
        .digest('hex');
    
    if (signature == hash) {
        console.log('Request signature ok');
        // move switch statement below here so it executes only when a valid signature is present
        res.sendStatus(200);
    } else {
        console.log('Invalid signature, ignoring request');
        res.sendStatus(401);
    }
    */
    switch (req.body.category) {
        case 'profanity_filter:replace':
            notifyProfanity(req.body.payload.message);
            break;
        default:
            console.log('Unhandled sendbird event: ', req.body.category);
            break;
    }
    return res.sendStatus(200);
});

// use Firebase cloud messaging to send out notifications to all registered clients
// Note that sendMulticast has a limit of 500 clients, so for applications that could have more, split the tokens up into batches of 500 tokens per call
function notifyProfanity(body) {
    console.log('Sending profanity filter notifications');
    const message = {
        data: { title: 'Profanity filter was triggered', body: body },
        tokens: tokens,
    }
    admin.messaging().sendMulticast(message).then((response) => {
        console.log(response.successCount + ' message(s) were sent successfully');
    });
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})