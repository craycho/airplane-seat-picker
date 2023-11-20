import { ReactElement, createContext, useState } from "react";

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

interface ContextType {
  isRoundTrip: boolean;
  setIsRoundTrip: React.Dispatch<React.SetStateAction<boolean>>;
  seatAmount: number;
  setSeatAmount: React.Dispatch<React.SetStateAction<number>>;
  flightClass: string;
  setFlightClass: React.Dispatch<React.SetStateAction<string>>;
  selectedFlight: FlightProps;
  setSelectedFlight: React.Dispatch<React.SetStateAction<FlightProps>>;
}

export const FlightContext = createContext<ContextType>({
  isRoundTrip: true,
  setIsRoundTrip: () => null,
  seatAmount: 1,
  setSeatAmount: () => null,
  flightClass: "economy",
  setFlightClass: () => null,
  selectedFlight: {
    basePrice: 0,
    departureDate: "",
    flightCode: "",
    seats: [],
    description: "",
    city: "",
    thumbnail: "",
  },
  setSelectedFlight: () => null,
});

const FlightContextProvider = ({ children }: { children: ReactElement }) => {
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);
  const [seatAmount, setSeatAmount] = useState<number>(1);
  const [flightClass, setFlightClass] = useState<string>("economy");
  const [selectedFlight, setSelectedFlight] = useState<FlightProps>({
    basePrice: 0,
    departureDate: "",
    flightCode: "",
    seats: [],
    description: "",
    city: "",
    thumbnail: "",
  });

  return (
    <FlightContext.Provider
      value={{
        isRoundTrip: isRoundTrip,
        setIsRoundTrip: setIsRoundTrip,
        seatAmount: seatAmount,
        setSeatAmount: setSeatAmount,
        flightClass: flightClass,
        setFlightClass: setFlightClass,
        selectedFlight: selectedFlight,
        setSelectedFlight: setSelectedFlight,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export default FlightContextProvider;
