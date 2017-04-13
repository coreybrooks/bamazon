var mysql = require('mysql');

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
    });
}

module.exports = displayTable;