// const { get } = require("http");

const confirmation = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("id");
  try {
    let confirmReservation = await fetch(`/confirmed/${myParam}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let response = await confirmReservation.json();
    reservationInfo(response);
  } catch (err) {
    console.log(err);
  }
};
confirmation();

function reservationInfo(response) {
  let flight = document.getElementById("flight");
  flight.innerHTML = response.reservation.flightNumber;

  let seat = document.getElementById("seat");
  seat.innerHTML = response.reservation.seat;

  let name = document.getElementById("name");
  name.innerHTML =
    response.reservation.givenName + " " + response.reservation.surname;

  let email = document.getElementById("email");
  email.innerHTML = response.reservation.email;
}
