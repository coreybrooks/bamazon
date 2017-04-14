var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password: 'Bentley111',
    database: 'Bamazon'
});

//connect to mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
});

//function to prompt supervisor for which action they want
var supervisorPrompt = function() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "choose one of the following",
        choices: ["view product sales by department","create new department"]
    }]).then(function(answer){
            switch (answer.action) {
            case "view product sales by department":
            viewSales();            
            break;
            case "create new department":
            createDepartment();
            break;
        }
    });
}

//function to view sales by each department
var viewSales = function() {

    var query = "SELECT department_id,department_name,over_head_cost,total_sales,total_sales-over_head_cost AS total_profit FROM departments";
    connection.query(query, function(err, res){
        if (err) throw err;

        console.log("\n--------------------------\n");
        console.log("id|department_name|overhead_cost|total_sales|total_profit");
        console.log("---------------------");
        for(i=0; i<res.length; i++) {
            console.log(res[i].department_id + " |" + res[i].department_name + " | $" + 
            res[i].over_head_cost.toFixed(2) + "  | $" + res[i].total_sales.toFixed(2) + " | $" + res[i].total_profit.toFixed(2));
        }
        console.log("\n--------------------------\n");
        supervisorPrompt();
    });    
};

//function to create to a new department
var createDepartment = function() {
    inquirer.prompt([{
        "name": "departmentName",
        "type": "input",
        "message": "what is the name of the new department?"
    },{
        "name": "overhead",
        "type": "input",
        "message": "what is the overhead cost of this department?"
    },{
        "name": "initialSales",
        "type": "input",
        "message": "what is the current total sales for this department?"
    }]).then(function(answers){
        connection.query("INSERT INTO departments SET ?", {
         department_name: answers.departmentName,
         over_head_cost: answers.overhead,
         total_sales: answers.initialSales
        }, function(err, data){
             if (err) throw err
             console.log('\nnew department added!');
             console.log("---------------------\n");
             supervisorPrompt();
         });
    });
}


//run the supervisorPrompt when the page first loads
supervisorPrompt();
