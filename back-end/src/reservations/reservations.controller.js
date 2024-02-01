/**
 * List handler for reservation resources
 */
const bodyHas = require("../errors/bodyHas");
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validation middleware for POST/PUT methods

const VALID_PROPS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasValidMobile(req, res, next) {
  const { mobile_number } = req.body.data;
  const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  if (!phonePattern.test(mobile_number)) {
    return next({
      status: 400,
      message: `Mobile phone number invalid, must match input pattern: 'XXX-XXX-XXXX'`,
    });
  }
  next();
}

function hasValidDate(req, res, next) {
  const { reservation_date } = req.body.data;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(reservation_date)) {
    return next({
      status: 400,
      message: `reservation_date invalid, must match input pattern: 'YYYY-MM-DD'`,
    });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const timePattern = /^[0-9]{2}:[0-9]{2}$/;
  if (!timePattern.test(reservation_time)) {
    return next({
      status: 400,
      message: `reservation_time invalid, must match input patter: 'HH:MM'`,
    });
  }
  next();
}

function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;
  if (people < 0 || typeof people !== "number") {
    return next({
      status: 400,
      message: `people invalid, must be an integer received: ${people}`,
    });
  }
  next();
}

//US-02 validation middleware, checks for valid date inputs
function dateOccursInPast(req, res, next) {
  const { reservation_date } = req.body.data;
  const today = new Date();
  const dateString = reservation_date.split("-");
  const dateFromReq = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (dateFromReq >= today) {
    return next();
  } else if (dateFromReq.getDay() === 2 && dateFromReq < today) {
    return next({
      status: 400,
      message: `Sorry, we're closed Tuesdays! Resevations can only be made for future dates`,
    });
  } else {
    return next({
      status: 400,
      message: `Reservations can only be made for future dates`,
    });
  }
}

function occursOnTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const dateString = reservation_date.split("-");
  const today = new Date();
  const dateFromReq = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (dateFromReq.getDay() === 2) {
    return next({
      status: 400,
      message: `Sorry, we're closed Tuesdays!`,
    });
  }
  next();
}

//US-03 validation middleware, validate time inputs
function timeWithinBusinessHours(req, res, next) {
  const { reservation_time } = req.body.data;
  const timeFromReq = reservation_time.split(":");
  const hour = Number(timeFromReq[0]);
  const minute = Number(timeFromReq[1]);
  if (hour >= 10) {
    if (hour === 10) {
      if (minute >= 30) {
        return next();
      }
    }
    if (hour <= 21) {
      if (hour === 21) {
        if (minute <= 30) {
          return next();
        }
      }
      return next();
    }
  }
  if (hour <= 10 && minute < 30) {
    return next({
      status: 400,
      message: `Reservations must be made within business hours`,
    });
  }
  return next({
    status: 400,
    message: `Seating ends at 9:30 PM!`,
  });
}

//US-4 read validation middleware
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);
  if (data) {
    res.locals.reservation = data;
    res.locals.data = req.body.data;
    return next();
  }
  return next({
    status: 404,
    message: `reservation_id not found ${reservation_id}`,
  });
}

//US-6 validation middleware
function validStatusPost(req, res, next) {
  const { status } = req.body.data;
  if (status !== "seated" && status !== "finished") {
    return next();
  }
  return next({
    status: 400,
    message: `status cannot be 'seated' or 'finished'`,
  });
}

function hasValidStatus(req, res, next) {
  const { status } = res.locals.data;
  if (
    status !== "booked" &&
    status !== "seated" &&
    status !== "finished" &&
    status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: `status property must be one of: 'seated', 'booked', or 'finished'. Received: ${status}`,
    });
  }
  next();
}

function validateReservationStatus(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    next({
      status: 400,
      message: "reservation cannot already be finished.",
    });
  } else {
    return next();
  }
}

//US-8 validation middleware, validate status is 'booked' before deleting reservation
function validateStatusDelete(req, res, next) {
  const { status } = res.locals.reservation;
  if (status !== "booked") {
    return next({
      status: 400,
      message: `only reservations with a status of 'booked' can be canceled`,
    });
  } else {
    return next();
  }
}

//CRUDL middleware

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res, next) {
  const data = res.locals.reservation;
  res.status(200).json({ data });
}

async function updateStatus(req, res, next) {
  const { reservation } = res.locals;
  const { status } = req.body.data;
  const updatedReservation = {
    ...reservation,
    status,
  };
  const data = await service.updateStatus(updatedReservation);
  res.status(200).json({ data });
}

async function update(req, res, next) {
  const reservation = req.body.data;
  const data = await service.update(reservation);
  res.status(200).json({ data });
}

async function destroy(req, res, next) {
  const { reservation } = res.locals;
  const canceledReservation = {
    ...reservation,
    status: "canceled",
  };
  const data = await service.updateStatus(canceledReservation);
  res.status(200).json({ data });
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    const data = await service.listByDate(date);
    res.status(200).json({ data });
  } else if (mobile_number) {
    const data = await service.listByNumber(mobile_number);
    res.status(200).json({ data });
  } else {
    const data = await service.list();
    res.status(200).json({ data });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    bodyHas(...VALID_PROPS),
    hasValidMobile,
    validStatusPost,
    hasValidDate,
    dateOccursInPast,
    occursOnTuesday,
    hasValidTime,
    timeWithinBusinessHours,
    peopleIsNumber,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    bodyHas("status"),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(hasValidStatus),
    asyncErrorBoundary(validateReservationStatus),
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    bodyHas(...VALID_PROPS),
    hasValidDate,
    validStatusPost,
    hasValidDate,
    dateOccursInPast,
    occursOnTuesday,
    hasValidTime,
    timeWithinBusinessHours,
    peopleIsNumber,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(reservationExists),
    validateStatusDelete,
    asyncErrorBoundary(destroy),
  ],
};
