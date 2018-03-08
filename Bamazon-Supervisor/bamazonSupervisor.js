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

	

activityArray = ["View Summary", "View Profit by Department", "Create New Department", "Quit"];

function mainMenu() {
	process.stdout.write('\x1B[2J\x1B[0f');
	console.log("**************************************");
	console.log("**         Bamazon Supervisor       **");
	console.log("**             Main Menu            **");
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
					viewEverything();
					break;
				case activityArray[1]:
					viewSales();
					break;
				case activityArray[2]:
					addDepartment();
					break;
				case activityArray[3]:
					console.log ("Goodbye!");
					connection.end();
					return;
			}
		});

}


function viewEverything() {
	process.stdout.write('\x1B[2J\x1B[0f');
	console.log("**************************************");
	console.log("**         Bamazon Supervisor       **");
	console.log("**           Master Sumary          **");
	console.log("**************************************");
	console.log(" ");	


	// var query = [product_name, price, stock_quantity, product_sales];

	// connection.query("SELECT ? FROM products", query, function(err, res) {

	connection.query("SELECT departments.department_name, products.product_name, products.price, products.stock_quantity, products.product_sales FROM products INNER JOIN departments ON departments.department_name=products.department_name", function(err, res) {
		if (err) throw err;
		var responseLength = res.length;
		var values = [];
		for (i=0; i<responseLength; i++) {
			var itemData = [];
			itemData.push(res[i].department_name);
			itemData.push(res[i].product_name);
			itemData.push("$" + res[i].price);
			itemData.push(res[i].stock_quantity);
			itemData.push(res[i].product_sales);
			values.push(itemData);
		}

		console.table(["Department", "Item Name", "Price", "In Stock", "Sales"], values);
		
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

function viewSales() {
	process.stdout.write('\x1B[2J\x1B[0f');
	console.log("**************************************");
	console.log("**         Bamazon Supervisor       **");
	console.log("**        Profit by Department      **");
	console.log("**************************************");
	console.log(" ");	

	connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS totalSales, (SUM(products.product_sales) - departments.overhead_costs) as deptProfits FROM departments INNER JOIN products ON departments.department_name=products.department_name GROUP BY departments.department_name, departments.department_id, departments.overhead_costs ORDER BY departments.department_id", function(err, res) {
		if (err) throw err;
		var responseLength = res.length;
		var values = [];
		for (i=0; i<responseLength; i++) {
			var itemData = [];
			itemData.push(res[i].department_id);
			itemData.push(res[i].department_name);
			itemData.push("$" + res[i].overhead_costs);
			itemData.push("$" + res[i].totalSales);
			itemData.push("$" + res[i].deptProfits);
			values.push(itemData);
		}

		console.table(["Dept ID", "Department Name", "Overhead", "Sales", "Profits"], values);
		
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



function addDepartment(){
	process.stdout.write('\x1B[2J\x1B[0f');
	console.log("**************************************");
	console.log("**         Bamazon Supervisor       **");
	console.log("**           Add Department         **");
	console.log("**************************************");
	console.log(" ");
	inquirer.prompt([
    {
      type: "input",
      message: "What is the name of your new department?",
      name: "dept"
    },
    {
      type: "input",
      message: "What is the overhead for this department",
      name: "cost"
    }
  ])
  .then(function(inquirerResponse) {
  		var newDept = inquirerResponse.dept;
  		var newOverhead = parseInt(inquirerResponse.cost);

  		console.log("Adding " + newDept + " with an overhead of " + newOverhead);

  		connection.query("INSERT INTO departments (department_name, overhead_costs) VALUES ('" + newDept +"', " + newOverhead + ")", function(err, res) {
			if (err) throw err;
			console.log("I think we're done");
			mainMenu();
		});
  	
   	});
}
