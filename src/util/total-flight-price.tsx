export const getTotalFlightPrice = (
  basePrice: number,
  isRoundTrip: boolean,
  seatAmount: number,
  flightClass: string
) => {
  const totalBasePrice = isRoundTrip
    ? basePrice * 1.8 * seatAmount
    : basePrice * seatAmount;

  switch (flightClass) {
    case "economy":
      return Math.round(totalBasePrice);

    case "business":
      return Math.round(totalBasePrice * 1.6);

    case "first":
      return Math.round(totalBasePrice * 2.5);
  }
};
