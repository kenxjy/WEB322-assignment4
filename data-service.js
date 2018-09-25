// require file server
var fs = require('fs');

// declare data arrays
var employees = [];
var departments = [];


// export functions
module.exports = {
    initialize: function() {
        let success = 0;
        let promise = new Promise(function(resolve, reject) {
            fs.readFile('./data/employees.json','utf8',(err,data) => {
                if (err) {
                    console.log("Error! employees.json could not be loaded!")
                } else {
                    employees = JSON.parse(data);
                    console.log("employees.json loaded!");
                    success = 1;

                    fs.readFile('./data/departments.json','utf8',(err,data) => {
                        if (err) {
                            console.log("Error! employees.json could not be loaded!");
                        } else {
                            departments = JSON.parse(data);
                            console.log("departments.json loaded!");
                            success = 2;
                        }
                    });
                }
            });

            if (success == 2) {
                resolve("It worked!");
            } else {
                reject("Data could not be initialized!");
            }

        });

        return promise;
    },

    getAllEmployees: function() {
        let promise = new Promise(function(resolve,reject) {
            if (employees.length > 0) {
                resolve(employees);
            } else {
                reject("No results returned");
            }
        });

        return promise;
    },

    getManagers: function() {
        let managers = [];
        let promise = new Promise(function(resolve, reject) {
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].isManager == true) {
                    managers.push(employees[i]);
                }

                if (managers.length > 0) {
                    resolve(managers);
                } else {
                    reject("No results returned");
                }
            }
        });

        return promise;
    },
    
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
};