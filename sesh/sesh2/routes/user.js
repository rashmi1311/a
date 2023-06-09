const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/dashboard',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/dashboard.html'));
})

router.get('/order',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/order.html'));
})

router.get('/payment',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/payment.html'));
})

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/auth/login');    
})


module.exports = router;