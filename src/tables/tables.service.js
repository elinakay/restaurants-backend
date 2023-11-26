// Import the database connection module
const knex = require("../db/connection.js");

// Function to list all tables
function list() {
  return knex("tables")
    .select("*")
    .orderBy("table_name"); // Retrieve all tables and order them by table_name
}

// Function to read a specific table by its ID
function read(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .first(); // Retrieve the first matching table
}

// Function to create a new table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]); // Insert a new table, return it, and extract the first record
}

// Function to update the table and reservation status when seating a reservation
function update(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" }) // Update the reservation status to "seated"
      .transacting(trx);

    return knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id: reservation_id }, "*") // Update the table with the reservation ID
      .update({
        occupied: knex.raw("NOT ??", ["occupied"]), // Toggle the "occupied" status
      })
      .transacting(trx)
      .then((createdRecords) => createdRecords[0]); // Return the updated table
  });
}

// Function to update the table and reservation status when finishing a reservation
function finish(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "finished" }) // Update the reservation status to "finished"
      .transacting(trx);

    return knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id: null }, "*") // Clear the reservation ID from the table
      .update({
        occupied: knex.raw("NOT ??", ["occupied"]), // Toggle the "occupied" status
      })
      .transacting(trx)
      .then((createdRecords) => createdRecords[0]); // Return the updated table
  });
}

// Export the functions for use in the application
module.exports = {
  list,
  read,
  create,
  update,
  finish,
};
