# Bamazon
## Node Retail Inventory System

Bamazon is a Node.js version of a retail store inventory system.  Below is a list of it's features, including some enhancements.

**Bamazon Customer** -- Prompts the user if they'd like to shop.  If so:
*  It provides list of inventory.  The user is asked if they'd like to make a purchase.  If so:
*  They are prompted for the item number coorisponding to the item they want
*  They chose the quantity they'd like to purchase
	 *if they want more than we have in inventopry, it does not make the purchase, otherwise*
*  The total purchase price is displayed and the DB is updated with the new (current) inventory amount

Here's a video of the Customer interface:

[![Bamazon Customer Interface](http://img.youtube.com/vi/ZuWHI9Z-BTM/0.jpg)](http://www.youtube.com/watch?v=ZuWHI9Z-BTM)


**Bamazon Manager** -- provides a menu whereby a manager can:
*  View all products for sale
*  View low inventory
	**NOTE:** I ennhanced this feature to allow the manager to select the amount of inventory that they will get a report on
*  Add additional inventory to an existing product
*  Add a new product to the store
	 **NOTE:** Instead of allowing the Manager to input a Department name, I give them a choice of existing departments, which I get from the departments DB
			
Here's a video of the Manager interface:

[![Bamazon Customer Interface](http://img.youtube.com/vi/VDk9Vs-nm6E/0.jpg)](http://www.youtube.com/watch?v=VDk9Vs-nm6E)


**Bamazon Supervisor** -- Allows new departments to be created and reports run on the profitability of different departments

Here's a video of the Supervisor interface:

[![Bamazon Customer Interface](http://img.youtube.com/vi/_abAZFuwpoE/0.jpg)](http://www.youtube.com/watch?v=_abAZFuwpoE)
