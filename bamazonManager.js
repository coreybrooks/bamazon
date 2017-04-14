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

//function to prompt manager for which action they want
var managerPrompt = function() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "choose one of the following",
        choices: ["view products for sale", "view low inventory", 
        "add to inventory", "add new product"]
    }]).then(function(answer){
            switch (answer.action) {
            case "view products for sale":
            displayTable();            
            break;
            case "view low inventory":
            viewInventory();
            break;
            case "add to inventory":
            addInventory();
            break;
            case "add new product":
            addProduct();
            break;
        }
    });
}

//function to display the products table from the database
var displayTable = function () {
    connection.query('SELECT * FROM products', function(err, res){
        if (err) throw err;

        console.log("\n--------------------------\n");
        console.log("id | product  | price");
        console.log("---------------------");
        for(i=0; i<res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("\n--------------------------\n");
        managerPrompt();
    });    
}


//function to check for and display inventory with fewer than 5 units
var viewInventory = function() {
    var query =  "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, data){
        if (err) throw err
        console.log("\n--LOW INVENTORY--");
        console.log("---------------------");
        console.log("id | product  | stock_quantity");
        console.log("---------------------");
        for(i=0; i<data.length; i++) {
            console.log(data[i].item_id + " | " + data[i].product_name + " | " + data[i].stock_quantity);
        }
        console.log("--------------------------\n");
        managerPrompt();
    });
}

//function to allow the manager to add inventory
var addInventory = function() {
    inquirer.prompt([{
        "name": "id",
        "type": "input",
        "message": "what is the item_id of the product you wish to add?"
    }, {
        "name": "quantity",
        "type": "input",
        "message": "how many units would you like to add?"
    }]).then(function(answer){
        //first query pulls the current stock_quantity for the item_id
        var query1 = "SELECT stock_quantity FROM products WHERE ?";
         connection.query(query1, {item_id:answer.id}, function(err,data) {
             if (err) throw err
             dataQuantity = data[0].stock_quantity + parseInt(answer.quantity);
             secondQuery(dataQuantity); 
        });        
        //second query is a function that runs with data from the first query
        //to update the inventory
        var secondQuery = function (dataQuantity) {
        var query2 = "UPDATE products SET ? WHERE ?";
            connection.query(query2, [{stock_quantity : dataQuantity},
            {item_id : answer.id}], function(err, data){
                if (err) throw err
                console.log("\nnew units added!");
                console.log("---------------\n");
                managerPrompt();
            });
        }
    });
}

//function to add new products
var addProduct = function() {
    inquirer.prompt([{
        "name": "productName",
        "type": "input",
        "message": "what is the name of the new product?"
    },{
        "name": "departmentName",
        "type": "input",
        "message": "in which department will this product be placed?"
    },{
        "name": "unitPrice",
        "type": "input",
        "message": "what is the unit price for the new product?"
    },{
        "name": "initialQuantity",
        "type": "input",
        "message": "how many units are being added?"
    }]).then(function(answers){
        connection.query("INSERT INTO products SET ?", {
         product_name: answers.productName,
         department_name: answers.departmentName,
         price: answers.unitPrice,
         stock_quantity: answers.initialQuantity
        }, function(err, data){
             if (err) throw err
             console.log('\nproduct added!');
             console.log("---------------------\n");
             managerPrompt();
         });
    });
}

//prompt the manager when the page initially loads
managerPrompt();