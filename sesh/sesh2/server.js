const express =  require('express');
const app = express();
// const fetch = require("node-fetch");
const port = 5500;

app.use(express.static('public'));
app.use(express.json());
//app.use(express.urlencoded({extended: false}));

app.get('/info',(req,res)=>{
    res.json({'info': 'Preset Text'});
})

app.post('/',(req,res)=>{
    const {sendData} = req.body;
    if(sendData)
    console.log("success" +" "+ sendData);
    res.json("ok");
})



app.listen(port, ()=>{
    console.log('Server is listening at :'+ port);
})

