import { Box, Typography, styled } from "@mui/material";

const SeatBox = styled(Box)({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  height: 30,
  width: 30,
  borderRadius: "3px",
});
const SeatText = styled(Typography)({
  fontSize: "13px",
  color: "#141414",
});

interface Seat {
  number: string;
  class: string;
  available: boolean;
}
interface SeatProps {
  seat: Seat;
  notOccupied: boolean;
  onChooseSeat: (seatNo: string) => void;
}

export default function Seat({ seat, notOccupied, onChooseSeat }: SeatProps) {
  const columnNumber = seat.number.match(/(\d+)/);
  const topPosition = columnNumber ? +columnNumber[0] : 1;
  const leftPosition = seat.number.includes("a")
    ? 15
    : seat.number.includes("b")
    ? 55
    : seat.number.includes("c")
    ? 185
    : 225;

  return (
    <SeatBox
      sx={{
        top: topPosition * 35 - 25,
        left: leftPosition,
        bgcolor: seat.available
          ? "lightblue"
          : !notOccupied
          ? "#a5a5a5"
          : "#54ca54",
        cursor: notOccupied ? "pointer" : "default",
        "&:hover": {
          backgroundColor: notOccupied ? "#4777b3" : "none",
        },
      }}
      onClick={() => {
        if (notOccupied) {
          onChooseSeat(seat.number);
        }
      }}
    >
      <SeatText>{notOccupied ? seat.number.toUpperCase() : "X"}</SeatText>
    </SeatBox>
  );
}
