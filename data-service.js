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

// require file server
var fs = require('fs');

// declare data arrays
var employees = [];
var departments = [];


// export functions
module.exports = {
    // retrieve data from json files
    initialize: function() {
        let promise = new Promise(function(resolve, reject) {
            // read employees.json
            fs.readFile('./data/employees.json','utf8',(err,data) => {
                if (err) {
                    reject("Error! employees.json could not be loaded!");
                } else {
                    // parse data into employees array
                    employees = JSON.parse(data);
                    console.log("Succuss! employees.json loaded!");

                    // read departments.json
                    fs.readFile('./data/departments.json','utf8',(err,data) => {
                        if (err) {
                            reject("Error! departments.json could not be loaded!");
                        } else {
                            // parse data into departments array
                            departments = JSON.parse(data);
                            console.log("Succuss! departments.json loaded!");
                            resolve('Server initialization successful!');
                        }
                    });
                }
            });
        });

        return promise;
    },

    // return all employees
    getAllEmployees: function() {
        let promise = new Promise(function(resolve,reject) {
            if (employees.length > 0) {
                resolve(employees);
            } else {
                reject('No results returned!');
            }
        });
        
        return promise;
    },
    
    // return managers
    getManagers: function() {
        let managers = []; 
        let promise = new Promise(function(resolve, reject) {
            // parse employees array
            for (let i = 0; i < employees.length; i++) {
                // add managers to manager array
                if (employees[i].isManager == true)
                    managers.push(employees[i]);
            }

            if (managers.length > 0) {
                resolve(managers);
            } else {
                reject("No results returned!");
            }
        });

        return promise;
    },
    
    // return departments
    getDepartments: function() {
        let promise = new Promise(function(resolve,reject) {
            if (departments.length > 0) {
                resolve(departments);
            } else {
                reject("No results returned");
            }
        });

        return promise;
    },

    addEmployee: function(employeeData) {
        let promise = new Promise(function(resolve, reject) {
            // parse employeeData
            // if avoids the issue of checkbox not sending "false" if left unchecked. 
            if (!employeeData.isManager)
                employeeData.isManager = false;
            
            employeeData.employeeNum = employees.length + 1;
            employees.push(employeeData);
            resolve("Success");
        });

        return promise;
    },

    getEmployeesByStatus: function(status) {
        let empByStatus = [];
        let promise = new Promise(function(resolve, reject) {
            // validate status
            if (status == "Full Time" || status == "Part Time") {
                // check employees array for status
                for (let i = 0; i < employees.length; i++) {
                    if (employees[i].status == status)
                        empByStatus.push(employees[i]);
                }

                if (empByStatus.length > 0) {
                    resolve(empByStatus);
                } else {
                    reject("No results returned");
                }
            } else {
                reject("Invalid Status");
            }
        });

        return promise;
    },

    getEmployeesByDepartment: function(department) {
        let empByDep = [];
        let promise = new Promise(function(resolve, reject) {
            // validate department
            if (1 <= department && department <= 7) {
                for (let i = 0; i < employees.length; i++) {
                    if (employees[i].department == department)
                        empByDep.push(employees[i]);
                }

                if (empByDep.length > 0) {
                    resolve(empByDep);
                } else {
                    reject("No results returned");
                }
            } else {
                reject("Invalid Department Number");
            }
        });

        return promise;
    },

    getEmployeesByManager: function(manager) {
        let empByMan = [];
        let promise = new Promise(function(resolve, reject) {
            // validate manager
            if (1 <= manager && manager <= 31) {
                for (let i = 0; i < employees.length; i++) {
                    if (employees[i].employeeManagerNum == manager)
                        empByMan.push(employees[i]);
                }

                if (empByMan.length > 0) {
                    resolve(empByMan);
                } else {
                    reject("No results found");
                }
            } else {
                reject("Invalid Manager Number");
            }
        });

        return promise;
    }, 

    getEmployeesByNum: function(empNum) {
        let promise = new Promise(function(resolve, reject) {
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].employeeNum == empNum) 
                    resolve(employees[i]);
            }

            reject("Employee " + empNum + " was not found!");
        });

        return promise;
    }
};