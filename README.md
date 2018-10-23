# WEB322 - Assignment 3

This project adds on to the demonstration of Node.js found in [https://github.com/Tibbs39/WEB322-assignment2](assignment 2). 

The following is demonstrated with this project:
- Routing GET requests containing queries and returning requested data. 
- Using multer to upload and store files
- Using body-parser to parse data from a form, then add it to the database

The following queries are available:
```
/employees?status
```
This returns a list of employees filtered by status, either "Full Time" or "Part Time". For example `/employees?status=Full Time` returns a list of employees that have "Full Time" status

```
/employees?department
```
This returns a list of employees filtered by department. For example `/employees?department=1` returns a list of employees that are in department 1.

```
/employees?manager
```
This returns a list of employees filtered by their manager number. For example `/employees?manager=1` returns a list of employees who's manager's employee number is 1.

```
/employees/:num
```
This returns the result of searching for an employee by their employee number. For example `/employees/2` will return employee number 2.

This webapp was uploaded to heroku and can be viewed here: [https://shrouded-badlands-69336.herokuapp.com/](https://shrouded-badlands-69336.herokuapp.com/)

*My intention with uploading school assignments on GitHub is merely to build a portfolio of my work.* **_Please do not plagiarize._**
