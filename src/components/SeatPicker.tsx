import { useState, useEffect, useContext } from "react";
import { FlightContext } from "../context/flight-context";
import { UIContext } from "../context/ui-context";
import Seat from "./Seat";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  styled,
} from "@mui/material";

const containerStyle = {
  position: "relative",
  height: "90vh",
  width: "270px",
  marginTop: "10px",
  bgcolor: "#dadada",
};
const PickerBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const ClearButton = styled(Button)({
  position: "absolute",
  top: 20,
  right: 100,

  height: 40,
  backgroundColor: "#bdbdbd",
  color: "#f6f6f6",
  fontWeight: 700,

  "&:hover": {
    backgroundColor: "grey",
  },
});

const BackButton = styled(Button)({
  position: "absolute",
  top: 20,
  left: 20,

  minWidth: 35,
  height: 35,
  borderRadius: "50%",
  backgroundColor: "salmon",
  color: "#f6f6f6",
  fontWeight: 700,

  "&:hover": {
    backgroundColor: "#d87165",
  },
});
const SubmitButton = styled(Button)({
  position: "absolute",
  bottom: 20,
  right: 100,

  width: 130,
  height: 45,
  backgroundColor: "#54ca54",
  color: "white",
  fontWeight: 700,
  textShadow: "1px 1px #4d4d4d",

  "&:active": {
    transform: "translateY(3px)",
  },
  "&:hover": {
    backgroundColor: "#46a946",
  },
});
const SubmitLoader = styled(CircularProgress)({
  height: 25,
  width: 25,
  color: "white",
});

const ErrorAlert = styled(Alert)({
  width: "50%",
  marginTop: "20px",
});
const SuccessAlert = styled(Alert)({
  width: "30%",
  marginTop: "20px",
});

interface Seat {
  number: string;
  class: string;
  available: boolean;
}

export default function SeatPicker() {
  const {
    selectedFlight,
    setSelectedFlight,
    seatAmount: allowedSeatAmount,
  } = useContext(FlightContext);
  const { setSeatSelectionOpen, setFlightSelectionOpen } =
    useContext(UIContext);

  const [occupiedSeats, setOccupiedSeats] = useState<Seat[]>([]);
  const [numberOfSelectedSeats, setNumberOfSelectedSeats] = useState<number>(0); // Helper state, makes checking availability easier
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [successVisible, setSuccessVisible] = useState<boolean>(false);

  const flightDate = new Date(selectedFlight.departureDate);
  const flightDateFormatted = flightDate.toLocaleString("default", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // On load makes sure previously occupied seats are unselectable
  useEffect(() => {
    setOccupiedSeats(selectedFlight.seats.filter((seat) => !seat.available));
  }, []);

  const chooseSeatHandler = (seatNo: string) => {
    const chosenSeat = selectedFlight.seats.find(
      (seat) => seat.number === seatNo
    );
    if (!chosenSeat) return null;

    const newSeats = selectedFlight.seats.map((seat) => {
      if (seat.number === chosenSeat?.number) {
        return {
          number: seat.number,
          class: seat.class,
          available: !seat.available,
        };
      } else return seat;
    });

    if (chosenSeat.available && numberOfSelectedSeats < allowedSeatAmount) {
      // Selects seat
      setErrorVisible(false);
      setSelectedFlight({ ...selectedFlight, seats: newSeats });
      setNumberOfSelectedSeats((prev) => ++prev);
    } else if (
      chosenSeat.available &&
      numberOfSelectedSeats >= allowedSeatAmount
    ) {
      setErrorVisible(true);
    } else {
      // Deselects seat
      setErrorVisible(false);
      setSelectedFlight({ ...selectedFlight, seats: newSeats });
      setNumberOfSelectedSeats((prev) => --prev);
    }
  };

  const bookSeatsHandler = () => {
    const postSeats = async () => {
      setSuccessVisible(true);
      const postResponse = fetch(
        `https://airline-booking-app-11e4f-default-rtdb.europe-west1.firebasedatabase.app/${selectedFlight.city}/seats.json`,
        {
          method: "PUT",
          body: JSON.stringify(selectedFlight.seats),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTimeout(() => {
        setSuccessVisible(false);
        setSeatSelectionOpen(false);
        setFlightSelectionOpen(true);
      }, 1000);
    };
    postSeats();
  };

  const clearSeatsHandler = () => {
    const emptySeats = selectedFlight.seats.map((seat) => {
      return {
        number: seat.number,
        class: seat.class,
        available: true,
      };
    });
    setSelectedFlight({ ...selectedFlight, seats: emptySeats });
    const clearSeats = async () => {
      const postResponse = fetch(
        `https://airline-booking-app-11e4f-default-rtdb.europe-west1.firebasedatabase.app/${selectedFlight.city}/seats.json`,
        {
          method: "PUT",
          body: JSON.stringify(emptySeats),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };
    clearSeats();
  };

  return (
    <PickerBox>
      <Typography variant="subtitle1" mt={1.5}>
        {selectedFlight.city[0].toUpperCase() + selectedFlight.city.slice(1)},{" "}
        {flightDateFormatted}
      </Typography>
      {errorVisible &&
        (allowedSeatAmount === numberOfSelectedSeats ? (
          <ErrorAlert severity="error">
            Maximum number of seats already selected. Please deselect an
            existing seat, or refresh the page and choose a larger amount of
            seats.
          </ErrorAlert>
        ) : (
          <ErrorAlert severity="error">
            Invalid number of chosen seats. Please choose exactly{" "}
            {allowedSeatAmount} seats or refresh the page and select fewer from
            the dropdown menu.
          </ErrorAlert>
        ))}
      {successVisible ? (
        <SuccessAlert severity="success">
          Seat successfully booked, returning to flight selection.
        </SuccessAlert>
      ) : (
        <SubmitButton
          variant="contained"
          onClick={() => {
            numberOfSelectedSeats === allowedSeatAmount
              ? bookSeatsHandler()
              : setErrorVisible(true);
          }}
        >
          Continue →
        </SubmitButton>
      )}
      <BackButton
        onClick={() => {
          setSeatSelectionOpen(false);
          setFlightSelectionOpen(true);
        }}
      >
        ←
      </BackButton>
      <ClearButton onClick={clearSeatsHandler}>Clear all</ClearButton>
      <Container sx={containerStyle}>
        {selectedFlight.seats.length > 0 &&
          selectedFlight.seats.map((seat, index) => (
            <Seat
              key={index}
              seat={seat}
              onChooseSeat={chooseSeatHandler}
              notOccupied={
                !occupiedSeats.some((el) => el.number === seat.number)
              }
            />
          ))}
      </Container>
    </PickerBox>
  );
}
