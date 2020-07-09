// const { url } = require("inspector");

const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");

let selection = "";

const renderSeats = (seats) => {
  seatsDiv.innerHTML = "";
  document.querySelector(".form-container").style.display = "block";
  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");
      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      seat.innerHTML = seatsRemain(seatNumber, seats)
        ? seatAvailable
        : seatOccupied;

      // TODO: render the seat availability based on the data...
      // seat.innerHTML = seatAvailable;
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  if (flightNumber == "Select Flight") {
    console.log("hey: ", document.getElementById("flight").value);
    return;
  }
  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((data) => {
      renderSeats(data.flightsAvailable);
    });
  // TODO: contact the server to get the seating availability
  //      - only contact the server if the flight number is this format 'SA###'.
  //      - Do I need to create an error message if the number is not valid?

  // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
};

const handleConfirmSeat = async (event) => {
  event.preventDefault();
  if (document.getElementById("flight").value == "Select Flight") {
    window.alert("Please select flight!");
    return;
  }
  // TODO: everything in here!
  let response = await fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      flightNumber: document.getElementById("flight").value,
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      seat: document.getElementById("seat-number").innerHTML,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  let URL = await response.json();
  window.location.href = `confirmed.html?id=${URL.id}`;
};

function seatsRemain(seatNumber, seats) {
  let seatFound = seats.find((element) => {
    return element.id == seatNumber;
  });
  return seatFound.isAvailable;
}

flightInput.addEventListener("blur", toggleFormContent);
