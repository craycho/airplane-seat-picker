import { useContext } from "react";
import { UIContext } from "../context/ui-context";
import { FlightContext } from "../context/flight-context";
import { getTotalFlightPrice } from "../util/total-flight-price";

import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Container,
  Stack,
  styled,
  Typography,
} from "@mui/material";

const PickerContainer = styled(Container)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  maxWidth: 600,
  height: 150,
  borderRadius: 3,

  "&:hover": {
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transform: "scale(1.005)",
  },
});

const DescriptionText = styled(Typography)({
  fontSize: 12,
  maxHeight: 55,
  marginBottom: 7,
  textAlign: "justify",

  overflowY: "scroll",
  "::-webkit-scrollbar": {
    display: "hidden",
  },
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
interface CardProps {
  flightData: FlightProps;
}

export default function FlightCard({ flightData }: CardProps) {
  const { setFlightSelectionOpen, setSeatSelectionOpen } =
    useContext(UIContext);
  const { setSelectedFlight, seatAmount, isRoundTrip, flightClass } =
    useContext(FlightContext);
  const totalPrice = getTotalFlightPrice(
    flightData.basePrice,
    isRoundTrip,
    seatAmount,
    flightClass
  );

  const flightDate = new Date(flightData.departureDate);
  const flightDateFormatted = flightDate.toLocaleString("default", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const selectFlightHandler = () => {
    setFlightSelectionOpen(false);
    setSeatSelectionOpen(true);
    setSelectedFlight(flightData);
  };

  return (
    <PickerContainer>
      <Stack direction="column">
        <StyledCard onClick={selectFlightHandler}>
          <CardMedia
            sx={{ height: 150, minWidth: 200 }}
            image={flightData.thumbnail}
            title={flightData.city}
          />
          <CardContent sx={{ maxHeight: 100, overflowY: "hidden", padding: 2 }}>
            <Typography variant="body1" fontSize={17} lineHeight={0.8}>
              {flightData.city[0].toUpperCase() + flightData.city.slice(1)}
            </Typography>
            <Typography variant="caption">{flightDateFormatted}</Typography>
            <DescriptionText>{flightData.description}</DescriptionText>
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Typography variant="caption" fontWeight={700} fontSize={14}>
                {totalPrice} BAM
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Stack>
    </PickerContainer>
  );
}
