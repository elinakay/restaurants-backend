// Import required modules
const tablesService = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsController = require("../reservations/reservations.controller");

// Define properties that are required for a table
const hasRequiredProperties = hasProperties("table_name", "capacity");

// Define properties that are required for a reservation
const hasReservationId = hasProperties("reservation_id");

// Middleware to check if a table exists
async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await tablesService.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

// Middleware to validate the table name
function hasValidName(req, res, next) {
  const table_name = req.body.data.table_name;

  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `Invalid table_name`,
    });
  }
  next();
}

// Middleware to check if a table has sufficient capacity for a reservation
function hasSufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;

  if (capacity < people) {
    return next({
      status: 400,
      message: `Table does not have sufficient capacity`,
    });
  }
  next();
}

// Middleware to check if a table is free (not occupied)
function tableIsFree(req, res, next) {
  if (res.locals.table.occupied) {
    return next({
      status: 400,
      message: `Table is occupied`,
    });
  }
  next();
}

// Middleware to check if a table is not seated (reserved but not seated)
function tableIsNotSeated(req, res, next) {
  if (res.locals.reservation.status === "seated") {
    return next({
      status: 400,
      message: `Table is already seated`,
    });
  }
  next();
}

// Middleware to check if a table is occupied (reserved and seated)
function tableIsOccupied(req, res, next) {
  if (!res.locals.table.occupied) {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }
  next();
}

// Middleware to validate the table capacity
function hasValidCapacity(req, res, next) {
  const capacity = req.body.data.capacity;

  if (capacity < 1 || isNaN(capacity))
    return next({ status: 400, message: `Invalid capacity` });

  next();
}

// Controller function to list tables
async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

// Controller function to create a new table
async function create(req, res) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}

// Controller function to update a table
async function update(req, res) {
  const { reservation_id } = req.body.data;
  const data = await tablesService.update(reservation_id, res.locals.table.table_id);
  res.status(200).json({ data });
}

// Controller function to finish using a table
async function finish(req, res) {
  const data = await tablesService.finish(res.locals.table.reservation_id, res.locals.table.table_id);
  res.status(200).json({ data });
}

// Export the controllers and middleware functions
module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    hasValidName,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasReservationId,
    reservationsController.reservationExists,
    hasSufficientCapacity,
    tableIsNotSeated,
    tableIsFree,
    asyncErrorBoundary(update),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(finish),
  ],
};
