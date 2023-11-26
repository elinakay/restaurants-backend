// Import the database connection module
const db = require("../db/connection.js");

// Retrieve a list of reservations for a specific date
function list(reservation_date) {
  return db("reservations")
    .select("*")
    .where({ reservation_date }) // Filter by reservation_date
    .whereNot({ status: "finished" }) // Exclude finished reservations
    .orderBy("reservation_time"); // Sort by reservation_time
}

// Search for reservations based on a mobile number
function search(mobile_number) {
  return db("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    ) // Perform a search based on a formatted mobile_number
    .orderBy("reservation_date"); // Sort the results by reservation_date
}

// Read a reservation by its ID
function read(reservation_id) {
  return db("reservations")
    .select("*")
    .where({ reservation_id })
    .first(); // Retrieve the first matching reservation
}

// Create a new reservation
function create(reservation) {
  return db("reservations")
    .insert(reservation)
    .returning("*") // Return the newly created reservation
    .then((createdRecords) => createdRecords[0]); // Extract the first record from the result
}

// Update an existing reservation
function update(updatedRes) {
  return db("reservations")
    .select("*")
    .where({ reservation_id: updatedRes.reservation_id })
    .update(updatedRes, "*") // Update and return the updated reservation
    .then((createdRecords) => createdRecords[0]);
}

// Update the status of a reservation
function updateStatus(reservation_id, status) {
  return db("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: status }, "*") // Update and return the updated reservation with the new status
    .then((createdRecords) => createdRecords[0]);
}

// Export all the functions as part of the module
module.exports = {
  list,
  search,
  read,
  create,
  update,
  updateStatus,
};
