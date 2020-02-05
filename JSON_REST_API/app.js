const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const flask = require('flask');
// from flask import Flask, request, jonsify;
// const multer = require('multer');
// const upload = multer();

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://lliu79:' + process.env.MONGO_ATLAS_PW + '@cluster0-njx1n.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const productsRoutes = require('..\\JSON_REST_API\\routes\\products');
const ordersRoutes = require('..\\JSON_REST_API\\routes\\orders');
const usersRoutes = require('..\\JSON_REST_API\\routes\\users');

//Being able to parse data
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// app.use(upload.array()); 
// app.use(express.static('public'));

//Make sure there is no cross errors, no need here since only using postman for testing, not browsers
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE', 'GET');
        res.status(200).json({});
    }
    next();
});

//routes to handle requests
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);



app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
module.exports = app;