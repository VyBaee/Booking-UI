import React from "react";
import Header from '../Components/Header/hrmsHeader';
import BookingInformation from '../Components/Body/BookingInformation';
import BookingTime from "../Components/Body/BookingTime";

const Booking: React.FC = () => {
  return (
    <div>
      <Header />
      <BookingInformation />
      <BookingTime />
    </div>
  );
};

export default Booking;

export {};