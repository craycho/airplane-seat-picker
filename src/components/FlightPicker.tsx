import { useState, useEffect, useContext } from "react";
import FlightCard from "./FlightCard";
import { FlightContext } from "../context/flight-context";

import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PersonIcon from "@mui/icons-material/Person";

const PickerContainer = styled(Container)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  marginTop: 50,
});

interface SeatType {
  number: string;
  class: string;
  available: boolean;
}
interface FlightProps {
  basePrice: number;
  departureDate: string;
  flightCode: string;
  seats: SeatType[];
  description: string;
  city: string;
  thumbnail: string;
}

export default function FlightPicker() {
  const [flightsData, setFlightsData] = useState<FlightProps[]>([]);
  const [seatSelectOpen, setSeatSelectOpen] = useState<boolean>(false);

  const {
    isRoundTrip,
    setIsRoundTrip,
    seatAmount,
    setSeatAmount,
    flightClass,
    setFlightClass,
  } = useContext(FlightContext);

  useEffect(() => {
    const fetchSeats = async () => {
      const flightsResponse = await fetch(
        "https://airline-booking-app-11e4f-default-rtdb.europe-west1.firebasedatabase.app/.json"
      );
      const flights = await flightsResponse.json();
      const flightsArray: FlightProps[] = Object.keys(flights).map((city) => ({
        city: city,
        ...flights[city],
      }));

      setFlightsData(flightsArray);
    };
    fetchSeats();
  }, []);

  const handleTrip = (event: SelectChangeEvent) => {
    setIsRoundTrip(event.target.value === "Round trip" ? true : false);
  };
  const handleSeatNumber = (event: SelectChangeEvent) => {
    setSeatAmount(parseInt(event.target.value));
  };
  const handleFlightClass = (event: SelectChangeEvent) => {
    setFlightClass(event.target.value);
  };

  // console.log(isRoundTrip, seatAmount, flightClass);

  return (
    <PickerContainer>
      <Stack direction="column" gap={1}>
        <Box mb={2.5}>
          <FormControl sx={{ width: 140, mr: 2 }}>
            <Select
              variant="standard"
              disableUnderline
              id="trip"
              value={isRoundTrip ? "Round trip" : "One way"}
              onChange={handleTrip}
            >
              <MenuItem value={"Round trip"}>
                <SwapHorizIcon
                  sx={{ fontSize: 20, mr: 1, verticalAlign: "top" }}
                />
                Round trip
              </MenuItem>
              <MenuItem value={"One way"}>
                <ArrowRightAltIcon
                  sx={{ fontSize: 20, mr: 1, verticalAlign: "top" }}
                />
                One way
              </MenuItem>
            </Select>
          </FormControl>
          <PersonIcon
            sx={{ fontSize: 20, mr: 0.8, mt: 0.5, cursor: "pointer" }}
            onClick={() => setSeatSelectOpen((prev) => !prev)}
          />
          <FormControl sx={{ width: 55, mr: 2 }}>
            <Select
              variant="standard"
              disableUnderline
              id="seats-amount"
              value={seatAmount.toString()}
              onChange={handleSeatNumber}
              open={seatSelectOpen}
              onClick={() => setSeatSelectOpen((prev) => !prev)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: 100 }}>
            <Select
              variant="standard"
              disableUnderline
              id="flight-class"
              value={flightClass}
              onChange={handleFlightClass}
            >
              <MenuItem value={"economy"}>Economy</MenuItem>
              <MenuItem value={"business"}>Business</MenuItem>
              <MenuItem value={"first"}>First</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography variant="h6" pl={3} mb={1.5}>
          Suggested trips from Sarajevo
        </Typography>
        {flightsData.map((flight) => (
          <FlightCard key={flight.city} flightData={flight} />
        ))}
      </Stack>
    </PickerContainer>
  );
}
