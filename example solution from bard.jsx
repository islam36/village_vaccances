import React, { useState, useEffect } from "react";
import moment from "moment";

const HotelTimeline = () => {
  const [currentDate, setCurrentDate] = useState(moment());

  const rooms = [
    {
      id: 1,
      name: "Standard Room",
    },
    {
      id: 2,
      name: "Deluxe Room",
    },
    {
      id: 3,
      name: "Suite",
    },
  ];

  const reservations = [
    {
      id: 1,
      roomId: 1,
      fromDate: moment().date(1),
      toDate: moment().date(5),
    },
    {
      id: 2,
      roomId: 2,
      fromDate: moment().date(8),
      toDate: moment().date(14),
    },
    {
      id: 3,
      roomId: 3,
      fromDate: moment().date(22),
      toDate: moment().date(28),
    },
  ];

  const renderTimeline = () => {
    const daysOfMonth = moment(currentDate).daysInMonth();
    const roomsList = rooms.map((room) => {
      const reservationCells = reservations.filter(
        (reservation) => reservation.roomId === room.id
      );
      return (
        <tr key={room.id}>
          <th>{room.name}</th>
          {reservationCells.map((reservation) => (
            <td key={reservation.id}>
              {reservation.fromDate} - {reservation.toDate}
            </td>
          ))}
        </tr>
      );
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            {roomsList}
          </tr>
        </thead>
        <tbody>
          {Array(daysOfMonth)
            .fill("")
            .map((day, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Hotel Timeline</h1>
      {renderTimeline()}
    </div>
  );
};

export default HotelTimeline;
