// Import necessary modules
const express = require("express");
const router = express.Router();
const reservationsController = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

// Define routes for reservation resources
router.route("/")
  .post(reservationsController.create) // Route for creating a reservation
  .get(reservationsController.list)    // Route for listing reservations
  .all(methodNotAllowed);               // Handle unsupported HTTP methods

router.route("/:reservation_id")
  .get(reservationsController.read)    // Route for reading a specific reservation
  .put(reservationsController.update)  // Route for updating a specific reservation
  .all(methodNotAllowed);               // Handle unsupported HTTP methods

router.route("/:reservation_id/status")
  .put(reservationsController.updateStatus) // Route for updating the status of a reservation
  .all(methodNotAllowed);                    // Handle unsupported HTTP methods

module.exports = router;
