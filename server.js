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
var HTTP_PORT = process.env.PORT || 8080;
var path = require("path");

app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.use(express.static('public'));

app.listen(HTTP_PORT);