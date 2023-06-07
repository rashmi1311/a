// routing using HTTP server

// const http = require('http')
// const fs = require('fs')

// const server = http.createServer((req, res)=>{
//     let path = './public/'
//     switch(req.url){
//         case '/':
//             path += 'home.html'
//             break
//         case '/about':
//             path += 'about.html'
//             break
//         default:
//             path += 'error.html'
//             break
//     }
//     fs.readFile(path, (err, data)=>{
//         if(err)
//             console.log(err);
//         else
//             res.write(data)
//         res.end()
//     })
// })

// server.listen('3000', (err)=>{
//     if(err)
//         console.log('Error: ', err)
//     else
//         console.log('Server runnin at localhost 3000');
// })

/////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const app = express()

const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// parsing the incoming data
// This will help us parser an HTTP POST method request from an HTML document.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// fixing session parameters
const oneDay = 1000 * 60 * 60 * 24;    // time in ms (originally). ms se 1 day banaya yaha.
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",       // a random unique string key used to authenticate a session. It is stored in an environment variable and can’t be exposed to the public.
    saveUninitialized:true,                                 // allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.
    cookie: { maxAge: oneDay },                             // this sets the cookie expiry time. The browser will delete the cookie after the set duration elapses. The cookie will not be attached to any of the requests in the future. 
    resave: false                                           // It enables the session to be stored back to the session store, even if the session was never modified during the request. This can result in a race situation in case a client makes two parallel requests to the server. Thus modification made on the session of the first request may be overwritten when the second request ends. The default value is true. However, this may change at some point. false is a better alternative.
}));

// To initialize the session, we will set the session middleware inside the routes of the individual HTTP requests.
// When a client sends a request, the server will set a session ID and set the cookie equal to that session ID. The cookie is then stored in the set cookie HTTP header in the browser. Every time the browser (client) refreshes, the stored cookie will be a part of that request.

// setting authentication credentials
//username and password
const myusername = 'user1'
const mypassword = 'mypassword'

// a variable to save a session
var session;

// paths
app.get('/',(req,res) => {
    session = req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile('views/index.html',{root:__dirname})
});

// To create a session, the user will submit the credentials. 
// The server will verify these credentials received in the request’s body with the username and the password for the existing user.

/* If the credentials are valid:
- The user will be granted the necessary access.
- The server will create a temporary user session with a random string known as a session ID to identify that session.
- The server will send a cookie to the client’s browser. The session ID is going to be placed inside this cookie.

Once the client browser saves this cookie, it will send that cookie along with each subsequent request to the server. The server will validate the cookie against the session ID. If the validation is successful, the user is granted access to the requested resources on the server.

If the credentials are invalid, the server will not grant this user access to the resources. No session will be initialized, and no cookie will be saved. */

app.post('/user',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword){
        session = req.session;
        session.userid = req.body.username;      // session object me dala ye khudse (khud banaya tha)
        console.log(req.session)
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else{
        res.send('Invalid username or password');
    }
})

// When the user decides to log out, the server will destroy (req.session.destroy();) the session and clear out the cookie on the client-side. Cookies are cleared in the browser when the maxAge expires.

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen('3000', () => {
    console.log('Server running at port 3000')
})

