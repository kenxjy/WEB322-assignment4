/*****************************************************************************
*  WEB322 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca 
*  Academic Policy. No part of this assignment has been copied manually or 
*  electronically from any other source (including web sites) or distributed 
*  to other students. 
*  
*  Name:         Kenneth Yue 
*  Student ID:   1227932176 
*  Date:         November 12, 2018 
* 
*  Online (Heroku) URL: 
* 
*****************************************************************************/  

const service = require('./data-service.js')
const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const multer = require("multer");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const HTTP_PORT = process.env.PORT || 8080;

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

// set up engine for handlebars
app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        // helper function for changing the navbar
        navLink: function(url, options) {
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    } 
}));
app.set('view engine', '.hbs');

// add middleware for the helper function
app.use(function(req,res,next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

// setting up default route
app.get("/", function(req,res) {
    //res.sendFile(path.join(__dirname,"/views/home.html"));
    res.render('home');
});

// setting up route for /about
app.get("/about", function(req,res) {
    //res.sendFile(path.join(__dirname,"/views/about.html"));
    res.render('about');
});

// route for /employees
app.get("/employees", function(req,res) {
    // if /employees?status
    if (req.query.status) {
        service.getEmployeesByStatus(req.query.status)
        .then((value) => res.render('employees', {employees: value}))
        .catch((err) => res.render('employees', {message: err}));
    // /employees?department   
    } else if (req.query.department) {
        service.getEmployeesByDepartment(req.query.department)
        .then((value) => res.render('employees', {employees: value}))
        .catch((err) => res.render('employees', {message: err}));
    // /employees?manager
    } else if (req.query.manager) {
        service.getEmployeesByManager(req.query.manager)
        .then((value) => res.render('employees', {employees: value}))
        .catch((err) => res.render('employees', {message: err}));
    } else {
        // getAllEmployees if invalid query
        service.getAllEmployees()
        .then((value) => res.render('employees', {employees: value}))
        .catch((err) => res.render('employees', {message: err}));
    }
});

// setting up route for /employees/add
app.get("/employees/add", function(req,res) {
    //res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
    res.render('addEmployee');
});

app.post("/employees/add", function(req,res) {
    service.addEmployee(req.body).then(res.redirect('/employees'));
});

// route for /employee/:employeeNum
app.get("/employee/:employeeNum", function(req,res) {
    // parse if employeeNum is a number
    if (isNaN(req.params.employeeNum)) {
        // redirect if number is invalid
        res.redirect("/employees");    
    } else {
        service.getEmployeesByNum(req.params.employeeNum)
        .then(function(value) {
            res.render('employee', {employee: value});
        })
        .catch(function(err) {
            res.render('employee', {message: err});
        });
    }
});

// updating employees
app.post("/employee/update", (req, res) => {
    service.updateEmployee(req.body).then(res.redirect("/employees"));
});

// route for /managers
// depreciated
/* app.get("/managers", function(req,res) {
    service.getManagers()
    .then(function(value) {
        res.json(value);
    })
    .catch(function(err) {
        res.json({message: err});
    });
}); */

// route for /departments
app.get("/departments", function(req,res) {
    service.getDepartments()
    .then(function(value) {
        res.render('departments', {departments: value});
    })
    .catch(function(err) {
        res.render('departments', {message: err});
    });
});

// setting up route for /images/add
app.get("/images/add", function(req,res) {
    //res.sendFile(path.join(__dirname,"/views/addImage.html"));
    res.render('addImage');
});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    res.redirect('/images');
});

// route for /images
app.get("/images", function(req,res) {
    // read directory
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), 
    function(err, items) {
            res.render('images', {images: items});
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