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
        let promise = new Promise(function(resolve, reject) {
            // parse employees array
            let managers = collect(employees, "isManager", true);

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

    // NOTE: There's no data validation done.
    // In a real world scenario, data validation should be done on
    // both client and server side.S
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
        let promise = new Promise(function(resolve, reject) {
            // validate status
            // check using .toLowerCase() to ignore case
            status = status.toLowerCase();
            if (status == "full time" || status == "part time") {
                let empByStatus = collect(employees, "status", status, true);

                if (empByStatus.length > 0) {
                    resolve(empByStatus);
                } else {
                    reject("No results returned");
                }
            } else {
                reject("Status \"" + status + "\" is invalid!");
            }
        });

        return promise;
    },

    getEmployeesByDepartment: function(department) {
        let promise = new Promise(function(resolve, reject) {
            // validate department
            if (1 <= department && department <= 7) {
                let empByDep = collect(employees, "department", department);
                
                if (empByDep.length > 0) {
                    resolve(empByDep);
                } else {
                    reject("No results returned!");
                }
            } else {
                reject("Department number " + department + " does not exist!");
            }
        });

        return promise;
    },

    getEmployeesByManager: function(manager) {
        let promise = new Promise(function(resolve, reject) {
            // validate manager
            if (1 <= manager && manager <= 31) {
                let empByMan = collect(employees, "employeeManagerNum", manager);

                if (empByMan.length > 0) {
                    resolve(empByMan);
                } else {
                    reject("No results found!");
                }
            } else {
                reject("Manager number " + manager + " does not exist!");
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
    },

    updateEmployee: function(empData) {
        let promise = new Promise(function(resolve, reject) { 
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].employeeNum == empData.employeeNum) {
                    let keys = Object.keys(employees[i]);
                    for (let j in keys) 
                        employees[i][keys[j]] = empData[keys[j]];
                    resolve();
                }                    
            }
        });

        return promise;
    }
}; // end module.exports

// simple function for iterating an array and collecting key/value matchs
var collect = function(array, key, value, str = false) {
    let rtn = [];

    if (!str) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] == value)
                rtn.push(array[i]);
        }
    } else { // for case insensitive string comparison
        for (let i = 0; i < array.length; i++) {
            if (array[i][key].toLowerCase() == value)
                rtn.push(array[i]);
        }
    }

    return rtn;
}