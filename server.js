/*****************************************************************************
*  WEB322 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca 
*  Academic Policy. No part of this assignment has been copied manually or 
*  electronically from any other source (including web sites) or distributed 
*  to other students. 
*  
*  Name:         Kenneth Yue 
*  Student ID:   1227932176 
*  Date:         October 16, 2018 
* 
*  Online (Heroku) URL: https://shrouded-badlands-69336.herokuapp.com/
* 
*****************************************************************************/  

var service = require('./data-service.js')
var express = require("express");
var app = express();
var path = require("path");
var fs = require('fs');
var multer = require("multer");
var bodyParser = require('body-parser');

var HTTP_PORT = process.env.PORT || 8080;

// for css
app.use(express.static('public'));

// body parsing
app.use(bodyParser.urlencoded({extended: true}));

// defining storage
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        // write the filename as the current date down to the millisecond
        cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

// setting up default route
app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setting up route for /about
app.get("/about", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

// route for /employees
app.get("/employees", function(req,res) {
    // if /employees?status
    if (req.query.status) {
        service.getEmployeesByStatus(req.query.status)
        .then(function(value) {
            res.json(value);
        })
        .catch(function(err) {
            res.json({message: err});
        });
    // /employees?department   
    } else if (req.query.department) {
        service.getEmployeesByDepartment(req.query.department)
        .then(function(value) {
            res.json(value);
        })
        .catch(function(err) {
            res.json({message: err});
        });
    } else if (req.query.manager) {
        service.getEmployeesByManager(req.query.manager)
        .then(function(value) {
            res.json(value);
        })
        .catch(function(err) {
            res.json({message: err});
        });
    } else {
        // getAllEmployees if invalid query
        service.getAllEmployees()
        .then(function(value) {
            res.json(value);
        })
        .catch(function(err) {
            res.json({message: err});
        });
    }
});

// setting up route for /employees/add
app.get("/employees/add", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

// route for /employee/:employeeNum
app.get("/employees/:employeeNum", function(req,res) {
    // parse if employeeNum is a number
    if (isNaN(req.params.employeeNum)) {
        // redirect if number is invalid
        res.redirect("/employees");    
    } else {
        service.getEmployeesByNum(req.params.employeeNum)
        .then(function(value) {
            res.json(value);
        })
        .catch(function(err) {
            res.json({message: err});
        });
    }
});



app.post("/employees/add", function(req,res) {
    service.addEmployee(req.body)
    .then(res.redirect('/employees'));
});

// route for /managers
app.get("/managers", function(req,res) {
    service.getManagers()
    .then(function(value) {
        res.json(value);
    })
    .catch(function(err) {
        res.json({message: err});
    });
});

// route for /departments
app.get("/departments", function(req,res) {
    service.getDepartments()
    .then(function(value) {
        res.json(value);
    })
    .catch(function(err) {
        res.json({message: err});
    });
});

// setting up route for /images/add
app.get("/images/add", function(req,res) {
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    res.redirect('/images');
});

app.get("/images", function(req,res) {
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), 
    function(err, items) {
        var dir = {images : items};
        res.json(dir);
    });
});

// 404 message
app.use(function(req,res,next) {
    res.status(404).send('404: Page not found');
});

// setup listen
service.initialize()
.then(function(msg) {
    console.log(msg);
    app.listen(HTTP_PORT);
})
.catch(function(err) {
    console.log(err);
});