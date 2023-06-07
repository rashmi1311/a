require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const users = [
    {
        username: "user1",
        title: "title1"
    },
    {
        username: "user2",
        title: "title2"
    }
]

app.get('/users', authToken, (req, res) => {
    // sirf user ka data wapis kia jiska token aaya
    // res.json(users.filter(post => post.username == req.user.name));
    res.json(users);
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '30s'});
    res.json({ access_token: accessToken })
})

// to generate secret key:
// 1. type node in terminal
// 2. type: require('crypto').randomBytes(64).toString('hex')
// 3. jo string aayi, use bina quotes k copy kia and .env file me dala 

function authToken(req, res, next) {
    const authToken = req.headers['authorization']
    // auth me se sirf token portion nikalne k liye bec pehle Bearer likha tha
    // Bearer ko 0th index pr rakha, and token ko 1st index pe
    const token = authToken && authToken.split(' ')[1]
    if (token == null)
        return res.sendStatus(401)
    // agar token aaye to verify karna padega
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err)
            return res.sendStatus(401)
        req.user = user
        next()
    })
}

app.listen(3000, (err) => {
    if (err)
        console.log(err);
    else
        console.log('Server listening at http://localhost:3000/');
})


// inside .env
// ACCESS_SECRET_TOKEN = 6b10aad4e3d7738b9fea80c9e6e2d247be2a2a4ea05601ad152789ac187e84c56741c32de550538d3f2251a9945e5531991db9996c8efbc46d708c264059067a




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

