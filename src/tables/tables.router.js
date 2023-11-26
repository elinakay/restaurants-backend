// Import the necessary modules and the tables controller
const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

// Define the routes for table resources

// Route for creating and listing tables
router.route("/")
  .post(controller.create) // Handle POST requests to create a new table
  .get(controller.list)     // Handle GET requests to list tables
  .all(methodNotAllowed);   // Handle unsupported HTTP methods

// Route for seating and finishing a specific table
router.route("/:table_id/seat")
  .put(controller.update)   // Handle PUT requests to seat a table
  .delete(controller.finish) // Handle DELETE requests to finish using a table
  .all(methodNotAllowed);   // Handle unsupported HTTP methods

// Export the router for use in the application
module.exports = router;
