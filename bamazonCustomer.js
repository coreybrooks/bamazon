var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password: '',
    database: 'Bamazon'
});

//connect to mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
});

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
        firstPrompt();
    });
}

//function to prompt the user for the id and quantity of the product they want to purchase
var firstPrompt = function () { 
    inquirer.prompt([{
        name: 'id',
        type: 'input',
        message: 'What is the id number of the product you would like to order?'
    }, {
        name: 'quantity',
        type: 'input',
        message:'How many units would you like to purchase?'
    }]).then(function(answer) {
        //first query to products
        var query = "SELECT department_name, stock_quantity, product_sales, price FROM products WHERE ?"
        connection.query(query, {item_id: answer.id}, function (err, res) {

            //checks to see if there enough units in stock
            if(res[0].stock_quantity >= answer.quantity) {
                var dept = res[0].department_name;
                var adjustedQuantity = res[0].stock_quantity - answer.quantity;
                var purchasePrice = (answer.quantity * res[0].price).toFixed(2);

                //update the stock to adjust for the purchased items
                var query2 = "UPDATE products SET ? WHERE ?";
                connection.query(query2, [{stock_quantity : adjustedQuantity}, {item_id: answer.id}], 
                function(err, res) {
                    if (err) throw err
                    console.log('Thanks for your purchase!');
                    console.log('----------------');
                });

                //update the total price of the purchase to product_sales
                var adjustedSales = res[0].product_sales + parseFloat(purchasePrice);
                var query3 = "UPDATE products SET ? WHERE ?";
                connection.query(query3, [{product_sales: adjustedSales},{item_id: answer.id}],
                function(err, data) {
                    if (err) throw err
                    console.log('your total price is: $' + purchasePrice);
                    console.log("-----------------\n");
                });

                //check the current total sales of the department from the department table and update value
                var query4 = "SELECT total_sales FROM departments WHERE ?"
                connection.query(query4,{department_name:dept},function(err, data) {
                    if (err) throw err
                    var currentSales = data[0].total_sales;
                    var adjustedTotalSales = currentSales + parseFloat(purchasePrice);

                    //also update the total price of the purchase to total sales in department table
                    var query5 = "UPDATE departments SET ? WHERE ?"
                    connection.query(query5, [{total_sales:adjustedTotalSales},{department_name:dept}], function(err,data) {
                        if (err) throw err
                        firstPrompt();
                    });                    
                });
            }

            //alert the user if there are not enough units in stock
            else {
                console.log("Sorry, there are only " + res[0].stock_quantity + " units remaining");
                console.log("\n-------------------\n");
                firstPrompt();
            }
        });
    });
}

//display table when page first loads
displayTable();