import { useContext } from "react";
import { UIContext } from "./context/ui-context";
import FlightPicker from "./components/FlightPicker";
import SeatPicker from "./components/SeatPicker";

import { Box } from "@mui/material";

function App() {
  const { flightSelectionOpen, seatSelectionOpen } = useContext(UIContext);

  return (
    <Box sx={{ position: "relative" }}>
      {flightSelectionOpen && <FlightPicker />}
      {seatSelectionOpen && <SeatPicker />}
    </Box>
  );
}

export default App;
