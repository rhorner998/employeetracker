const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'fish00',
  database: 'sqlchallenge'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL successfully');

  // Check the connection by executing a simple query
  connection.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    console.log('Connection test successful');
  });

  // Start the application after successful connection
  startApp();
});

// Main function to start the application
function startApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewRoles() {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all employees
function viewEmployees() {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:'
    })
    .then(answer => {
      connection.query(
        'INSERT INTO department SET ?',
        { name: answer.name },
        err => {
          if (err) throw err;
          console.log('Department added successfully!');
          startApp();
        }
      );
    });
}

// Function to add a role
function addRole() {
  // You might need to fetch department names and ids to provide a choice for the user
  // and then map the selected department name to the corresponding department id.
  // I'm skipping that part for simplicity.

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:'
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Enter the department id for the role:'
      }
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
        },
        err => {
          if (err) throw err;
          console.log('Role added successfully!');
          startApp();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  // Similar to adding a role, you might need to fetch roles and managers data
  // to provide choices for the user.
  // I'm skipping that part for simplicity.

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the first name of the employee:'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the last name of the employee:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the role id for the employee:'
      },
      {
        type: 'input',
        name: 'managerId',
        message: 'Enter the manager id for the employee:'
      }
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          manager_id: answer.managerId
        },
        err => {
          if (err) throw err;
          console.log('Employee added successfully!');
          startApp();
        }
      );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
  // Similar to adding a role or employee, you might need to fetch employee names
  // and roles to provide choices for the user.
  // I'm skipping that part for simplicity.

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the id of the employee to update:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the new role id for the employee:'
      }
    ])
    .then(answer => {
      connection.query(
        'UPDATE employee SET role_id = ? WHERE id = ?',
        [answer.roleId, answer.employeeId],
        err => {
          if (err) throw err;
          console.log('Employee role updated successfully!');
          startApp();
        }
      );
    });
}
