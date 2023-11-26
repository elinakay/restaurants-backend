// Import required modules and libraries
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") }); // Load environment variables

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler"); // Import error handling middleware
const notFound = require("./errors/notFound"); // Import "not found" error middleware
const reservationsRouter = require("./reservations/reservations.router"); // Import reservations router
const tablesRouter = require("./tables/tables.router"); // Import tables router

const app = express(); // Create an Express application

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for the app
app.use(express.json()); // Parse JSON request bodies
app.options("*", cors()); // Handle CORS preflight requests

app.use("/reservations", reservationsRouter); // Mount the reservations router under the "/reservations" path
app.use("/tables", tablesRouter); // Mount the tables router under the "/tables" path

app.use(notFound); // Handle "not found" errors if no routes match
app.use(errorHandler); // Handle other errors using the error handling middleware

module.exports = app; // Export the Express application for use in the server
