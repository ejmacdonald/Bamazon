var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
	host: "localhost", 
	port:3306,

	user: "root",

	password: "",
	database: "bamazon"
});

connection.connect(function(err) {
	if(err) throw err;
	shop();

});

process.stdout.write('\x1B[2J\x1B[0f');

function shop() {
	inquirer.prompt({
			type: "confirm",
			message: "Would you like to see our product list?",
			name: "shop"
		})
		.then(function(inquirerResponse) {
			if (inquirerResponse.shop) {
				displayProducts();
			} else {
				console.log ("Goodbye!");
				connection.end();
				return;
			}
		});

}


function displayProducts() {
	process.stdout.write('\x1B[2J\x1B[0f');
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		var responseLength = res.length;
		var values = [];

		for (i=0; i<responseLength; i++) {
			var itemData = [];
			itemData.push(res[i].item_id);
			itemData.push(res[i].product_name);
			itemData.push("$" + res[i].price);
			itemData.push(res[i].stock_quantity)
			values.push(itemData);
		}

		console.log("**************************************");
		console.log("**         Bamazon Shop             **");
		console.log("**************************************");
		console.log(" ");

		console.table(["Item", "Item Name", "Price", "In Stock"], values);

		console.log("**************************************");
		console.log(" ");
		console.log(" ");


		inquirer.prompt({
			type: "confirm",
			message: "Ready to place an order?",
			name: "reqOrder"
		})
		.then(function(inquirerResponse) {
			if (inquirerResponse.reqOrder) {
				userOrder();
			} else {
				console.log ("Goodbye!");
				connection.end();
				return;
			}
		});
	});
}

function userOrder(){
	inquirer.prompt([
    // Here we create a basic text prompt.
    {
      type: "input",
      message: "Please input the item number you'd like to purchse",
      name: "itemNumber"
    },
    {
      type: "input",
      message: "How Many?",
      name: "numPurchased"
    }
  ])
  .then(function(inquirerResponse) {
  	var selectedItem = inquirerResponse.itemNumber;
  	var numWanted = inquirerResponse.numPurchased;

  	connection.query("SELECT * FROM products WHERE item_id =" + selectedItem, function(err, res) {
		if (err) throw err;
		currentInventory = (res[0].stock_quantity);
		currentPrice = (res[0].price);
		productSales = (res[0].product_sales);
		if (currentInventory >= numWanted) {
			var newInventory = currentInventory - numWanted;
			var orderTotal = numWanted * currentPrice;
			var newSales = productSales + orderTotal;

			connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [newInventory, newSales, selectedItem], function(err, res) {
				if (err) throw err;
				console.log("Order Approved, you total purchase is $" + orderTotal);
				shop();
			});
			} else {
			console.log ("Sorry, we don't have enough of that for you.");
			shop();
		}

	});
  	
   });
}

		