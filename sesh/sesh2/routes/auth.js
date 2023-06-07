const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'));
})

router.post('/login',(req,res)=>{
    const {username, password} = req.body;
    if(username == password){
        req.session.username = username;
        res.redirect('/user/dashboard');
    }
    else{
        res.redirect('/auth/errorPage');
    }
})

router.get('/errorPage',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/errorPage.html'));
})


module.exports = router;