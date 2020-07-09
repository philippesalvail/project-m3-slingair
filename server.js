"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");

const PORT = process.env.PORT || 8000;

// const handleConfirmation = (req, res) => {
//   let givenName = req.params.givenName;
//   let surname = req.params.surname;
//   let email = req.params.email;
//   let seat = req.params.seat;
//   let flightNumber = req.params.flightNumber;
//   res.render("confirmed", { givenName, surname, email, seat, flightNumber });
// };

const confirmedFlight = (req, res) => {
  let reservation = reservations.find((element) => element.id == req.params.id);
  if (reservation) {
    res.status(200).send({ reservation });
  } else {
    res.status(404).send({ error: `reservation: ${reservation} not listed` });
  }
};

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  if (allFlights.includes(flightNumber)) {
    let flightsAvailable = flights[flightNumber];
    res.status(200).send({ flightsAvailable });
  } else {
    res.status(404).send({ error: `Flight: ${flightNumber} not listed` });
  }
};

const seatingAvailability = (req, res) => {
  res.status(200).send({ flightsAvailable });
};

const confirmReservation = (req, res) => {
  let id = Math.floor(Math.random() * 100);
  let givenName = req.body.givenName;
  let surname = req.body.surname;
  let email = req.body.email;
  let seat = req.body.seat;
  let flightNumber = req.body.flightNumber;
  seat = seat.substring(1, seat.length - 1);
  let reservation = { id, givenName, surname, email, seat, flightNumber };
  reservations.push(reservation);
  res.send({ id });
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flights/:flightNumber", handleFlight)
  .get("/confirmed/:id", confirmedFlight)
  .post("/users", confirmReservation)

  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
