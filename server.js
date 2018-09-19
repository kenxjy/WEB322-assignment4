/*****************************************************************************
*  WEB322 – Assignment2 
*  I declare that this assignment is my own work in accordance with Seneca 
*  Academic Policy. No part of this assignment has been copied manually or 
*  electronically from any other source (including web sites) or distributed 
*  to other students. 
*  
*  Name:         Kenneth Yue 
*  Student ID:   1227932176 
*  Date:         September 18, 2018 
* 
*  Online (Heroku) URL: 
* 
*****************************************************************************/  

var express = require("express");
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

// setting up default route
app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setting up route for /about
app.get("/about", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

// for css
app.use(express.static('public'));

// setup listen
app.listen(HTTP_PORT);