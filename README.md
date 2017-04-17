# Bamazon
Node and mySQL application similar to Amazon's storefront.  This API consists of three node applications:
* customer interface
* manager interface
* supervisor interface

Here is a link to watch a demo of the application [on YouTube](https://www.youtube.com/watch?v=LvJuge7NW5I&feature=youtu.be)

### Customer Interface
The customer application is run by entering node bamazonCustomer.js in the node console.  The customer is then shown a table of available products and prompted as to which item they would like to purchase and the quantity of units.  The system then checks the products table in mySQL to make sure there is enough product available.  If there are enough units remaining, the system calculates the sales total and thanks the customer for their purchase.  It then adjusts the amount stock to reflect the purchase.  Next, the system updates the total sales for the item in the products table, and it updates the total profit for the corresponding department in the department's table.

### Manager Interface
The manager application is run by entering node bamazonManager.js.  The manager is prompted to enter one of the following options:
* view products for sale
* view low inventory
* add to inventory
* add new product

view products for sale: displays the table of available products

view low inventory: searches the products table in mySQL and returns the items for which the stock total is less than 5

add to inventory: prompts the manager for the item_id for the product to add and the number of units

add new product: prompts the manager for the following:
* the name of the new product
* the department in which the new product will be placed
* the unit price for the new product
* the number of units being added


### Supervisor Interface
The supervisor application is run by entering node bamazonSupervisor.js.  The supervisor is prompted to enter one of the following options:
* view product sales by department
* create new department

view product sales by department: displays information from the departments table in mySQL and creates a custom alias column for the departments total profits, which calculates the total profits on the fly

create new department: prompts the supervisor for the following:
* the name of the new department
* the overhead cost of the department
* the current total sales for the department







