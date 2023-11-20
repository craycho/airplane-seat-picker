import { ReactElement, createContext, useState } from "react";

interface ContextType {
  flightSelectionOpen: boolean;
  setFlightSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  seatSelectionOpen: boolean;
  setSeatSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UIContext = createContext<ContextType>({
  flightSelectionOpen: true,
  setFlightSelectionOpen: () => null,
  seatSelectionOpen: false,
  setSeatSelectionOpen: () => null,
});

const UIContextProvider = ({ children }: { children: ReactElement }) => {
  const [flightSelectionOpen, setFlightSelectionOpen] = useState<boolean>(true);
  const [seatSelectionOpen, setSeatSelectionOpen] = useState<boolean>(false);

  return (
    <UIContext.Provider
      value={{
        flightSelectionOpen: flightSelectionOpen,
        setFlightSelectionOpen: setFlightSelectionOpen,
        seatSelectionOpen: seatSelectionOpen,
        setSeatSelectionOpen: setSeatSelectionOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIContextProvider;
