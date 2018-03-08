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
	mainMenu()

});

process.stdout.write('\x1B[2J\x1B[0f');

activityArray = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"];

function mainMenu() {
	process.stdout.write('\x1B[2J\x1B[0f');

	console.log("**************************************");
	console.log("**         Bamazon Manager          **");
	console.log("**            Main Menu             **");
	console.log("**************************************");
	console.log(" ");

	inquirer.prompt({
			type: "list",
			message: "Please select an action below",
			name: "selectedActivity",
			choices: activityArray
		})
		.then(function(inquirerResponse) {
			console.log("selectedActivity: " + inquirerResponse.selectedActivity);
			switch (inquirerResponse.selectedActivity) {
				case activityArray[0]:
					displayProducts();
					break;
				case activityArray[1]:
					console.log("Here's your low inventory");
					lowInventory();
					break;
				case activityArray[2]:
					addQuantity();
					break;
				case activityArray[3]:
					addItem();
					break;
				case activityArray[4]:
					console.log ("Goodbye!");
					connection.end();
					return;
			}
		});

}


function displayProducts() {
	process.stdout.write('\x1B[2J\x1B[0f');

	console.log("**************************************");
	console.log("**         Bamazon Manager          **");
	console.log("**          Product List            **");
	console.log("**************************************");
	console.log(" ");


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

		console.table(["Item", "Item Name", "Price", "In Stock"], values);
		
		inquirer.prompt({
			type: "confirm",
			message: "Would you like to return to the Main Menu?",
			name: "returnMM"
		})
		.then(function(inquirerResponse) {
			if (inquirerResponse.returnMM) {
				mainMenu();
			} else {
				console.log ("Goodbye!");
				connection.end();
				return;
			}
		});

	});
}


function lowInventory(){
	process.stdout.write('\x1B[2J\x1B[0f');
	console.log("**************************************");
	console.log("**         Bamazon Manager          **");
	console.log("**         Check Inventory          **");
	console.log("**************************************");
	console.log(" ");

	inquirer.prompt([
    {
      type: "input",
      message: "Plese input a number for the amount of inventory you would like a report:",
      name: "invNumber"
    }
  ])
  .then(function(inquirerResponse) {
  		var numInv = inquirerResponse.invNumber;

  		connection.query("SELECT * FROM products WHERE stock_quantity <" + numInv, function(err, res) {
			if (err) throw err;
			var responseLength = res.length;
			var values = [];
			console.log ("Here are all ITEMS with an inventory less than " + numInv);
			for (i=0; i<responseLength; i++) {
				var itemData = [];
				itemData.push(res[i].item_id);
				itemData.push(res[i].product_name);
				itemData.push("$" + res[i].price);
				itemData.push(res[i].stock_quantity)
				values.push(itemData);
			}

			console.table(["Item", "Item Name", "Price", "In Stock"], values);


			inquirer.prompt({
				type: "confirm",
				message: "Would you like to return to the Main Menu?",
				name: "returnMM"
			})
			.then(function(inquirerResponse) {
				if (inquirerResponse.returnMM) {
					mainMenu();
				} else {
					console.log ("Goodbye!");
					connection.end();
					return;
				}
			});
		});
   });
}

function addQuantity(){
	process.stdout.write('\x1B[2J\x1B[0f');
	console.log("**************************************");
	console.log("**         Bamazon Manager          **");
	console.log("**          Add Inventory           **");
	console.log("**************************************");
	console.log(" ");

	inquirer.prompt([
    {
      type: "input",
      message: "Which ITEM # will you be adding more inventory",
      name: "itemNumber"
    },
    {
      type: "input",
      message: "How many are you adding?",
      name: "numAdded"
    }
  ])
  .then(function(inquirerResponse) {
  		var selectedItem = inquirerResponse.itemNumber;
  		var added = parseInt(inquirerResponse.numAdded);

  		console.log("Adding " + added + " to our inventory of item #" + selectedItem);

  		connection.query("SELECT * FROM products WHERE item_id =" + selectedItem, function(err, res) {
			if (err) throw err;
			currentInventory = (res[0].stock_quantity);
			var newInventory = currentInventory + added;
			console.log("Inventory added, you now have " + newInventory + " in stock.");
			connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newInventory, selectedItem], function(err, res) {
				if (err) throw err;
			});

			inquirer.prompt({
				type: "confirm",
				message: "Would you like to return to the Main Menu?",
				name: "returnMM"
			})
			.then(function(inquirerResponse) {
				if (inquirerResponse.returnMM) {
					mainMenu();
				} else {
					console.log ("Goodbye!");
					connection.end();
					return;
				}
			});
		});
  	
   	});
}


function addItem(){
	process.stdout.write('\x1B[2J\x1B[0f');
	console.log("**************************************");
	console.log("**         Bamazon Manager          **");
	console.log("**         Add New Product          **");
	console.log("**************************************");
	console.log(" ");
connection.query("SELECT DISTINCT department_name FROM departments", function(err, res) {
	if(err) throw err;
	var departmentArray = [];
	for (i=0; i<res.length; i++) {
		departmentArray.push(res[i].department_name);
	}

	inquirer.prompt([
    {
      	type: "input",
      	message: "What's the name of the item you're adding?",
      	name: "itemName"
    },
    {
      	type: "input",
      	message: "How many are you adding?",
      	name: "numAdded"
    },
    {
    	type: "list",
    	message: "To what department are you adding this thing?",
    	choices: departmentArray,
    	name: "department"
    },
    {
    	type: "input",
    	message: "What is the price of the item?",
    	name: "price"
    }
  ])

  .then(function(inquirerResponse) {
  		var itemName = inquirerResponse.itemName;
  		var numAdded = parseInt(inquirerResponse.numAdded);
  		var department = inquirerResponse.department;
  		var price = inquirerResponse.price;
  		var post = { product_name: itemName, stock_quantity: numAdded, price: price, department_name: department };

  		console.log("Adding " + numAdded + " " + itemName + " to " + department);



  		connection.query("INSERT INTO products Set ?", post, function(err, res) {
			if (err) throw err;

			inquirer.prompt({
				type: "confirm",
				message: "Would you like to return to the Main Menu?",
				name: "returnMM"
			})
			.then(function(inquirerResponse) {
				if (inquirerResponse.returnMM) {
					mainMenu();
				} else {
					console.log ("Goodbye!");
					connection.end();
					return;
				}
			});
		});
  	
   	});
});
}