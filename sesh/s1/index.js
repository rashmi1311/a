const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// get endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './home.html'))
})

app.get('/addtask', (req, res) => {
    res.sendFile(path.join(__dirname, './addTask.html'))
})

app.get('/tasks', (req, res) => {
    res.sendFile(path.join(__dirname, './server.json'))
})

// post endpoints
app.post('/addtask', (req, res) => {
    let obj = {
        data: req.body.taskContent
    }
    fs.readFile('./server.json', (err, tasks) => {
        if (err)
            console.log(err)
        else {
            tasks = JSON.parse(tasks)
            tasks.push(obj)
            fs.writeFile('./server.json', JSON.stringify(tasks), (err) => {
                console.log(err)
            })
        }
    })
    res.sendFile(path.join(__dirname, './addTask.html'))
})

// default
app.use('/:id', (req, res) => {
    res.status = '404'
    res.end("Error 404: Not Found")
})

app.listen(3000, (err) => {
    if (err)
        console.log(err)
    else
        console.log("Server running at: http://localhost:3000/")
})