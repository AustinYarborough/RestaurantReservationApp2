const bodyHas = require("../errors/bodyHas");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validation middleware for POST/PUT methods

const VALID_PROPS = ["table_name", "capacity"];

function hasValidName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2 || !table_name.length) {
    return next({
      status: 400,
      message: `table_name must be at least 2 characters long`,
    });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity !== Number(capacity)) {
    return next({
      status: 400,
      message: `capacity must be a number`,
    });
  }
  if (Number(capacity) < 1) {
    return next({
      status: 400,
      message: `capacity must be at least 1 person`,
    });
  }
  next();
}

//US-04 validation middleware, load reservation data and update table with it
async function dataExists(req, res, next) {
  const { data } = req.body;
  if (data) {
    return next();
  }
  next({
    status: 400,
    message: `body must have a data property`,
  });
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const data = await service.read(Number(table_id));
  if (data) {
    res.locals.table = data;
    return next();
  } else {
    return next({
      status: 404,
      message: `Table ${table_id} does not exist`,
    });
  }
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `An existing reservation_id is required`,
    });
  }
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist`,
    });
  }
}

function checkReservationStatus(req, res, next) {
  const { reservation } = res.locals;
  if ("status" in reservation) {
    if (reservation.status === "seated") {
      return next({
        status: 400,
        message: `Reservation is already seated`,
      });
    }
    return next();
  }
}

function checkCapacity(req, res, next) {
  const { table_option } = req.params;
  const { people } = res.locals.reservation;
  const { status, capacity } = res.locals.table;
  if (table_option === "seat") {
    if (status === "Free") {
      if (capacity >= people) {
        return next();
      } else {
        return next({
          status: 400,
          message: `Table does not have capacity for this reservation`,
        });
      }
    } else if (status === "Occupied") {
      return next({
        status: 400,
        message: `This table is already occupied`,
      });
    }
  } else {
    return next({
      status: 404,
      message: "Invalid table_option in path",
    });
  }
}

//US-05, check if table being finished truly has status of occupied
function checkOccupied(req, res, next) {
  const { status } = res.locals.table;
  if (status == "Occupied") {
    return next();
  } else {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }
}

//CRUDL middleware

async function create(req, res, next) {
  const { reservation_id } = req.body.data;
  if (reservation_id) {
    const newTable = {
      ...req.body.data,
      status: "Occupied",
    };
    const reservation = await reservationService.read(reservation_id);
    if (reservation.status !== "seated") {
      const updatedReservation = {
        ...reservation,
        status: "seated",
      };
      await reservationService.update(updatedReservation);
    }
    const response = await service.create(newTable);
    res.status(201).json({ data: response });
  } else {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
  }
}

async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table } = res.locals;
  const { table_id } = req.params;
  const updatedTable = {
    table_id,
    ...table,
    reservation_id,
    status: "Occupied",
  };
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  const data = await service.update(updatedTable, updatedReservation);
  res.status(200).json({ data });
}

async function destroy(req, res, next) {
  const { reservation_id } = res.locals.table;
  const newTable = {
    ...res.locals.table,
    reservation_id: null,
    status: "Free",
  };
  const reservation = await reservationService.read(reservation_id);
  const updatedReservation = {
    ...reservation,
    status: "finished",
  };
  await service.delete(newTable, updatedReservation);
  const data = await service.list();
  res.status(200).json({ data });
}

async function list(req, res, next) {
  const data = await service.list();
  res.status(200).json({ data });
}

module.exports = {
  create: [
    bodyHas(...VALID_PROPS),
    hasValidName,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(dataExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(checkReservationStatus),
    asyncErrorBoundary(checkCapacity),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(checkOccupied),
    asyncErrorBoundary(destroy),
  ],
  list: asyncErrorBoundary(list),
};
