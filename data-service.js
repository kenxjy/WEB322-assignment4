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

                if (managers.length > 0) {
                    resolve(managers);
                } else {
                    reject("No results returned!");
                }
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
};