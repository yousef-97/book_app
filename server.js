'use strict';


require('dotenv').config();

//dependencies
const express = require('express');
const superagent = require('superagent');

//PORT
const PORT = process.env.PORT || 3000;

//the App
const app = express();

//
app.use(express.static('./public'));

//
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//
app.set('view engine','ejs');

//
app.get('/',(request,response)=>{
    response.render('index');
})

/////////errors and listen////
app.get('*',(request,response)=>{
    response.status(404).send('NOT FOUND');
})

app.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`);
})