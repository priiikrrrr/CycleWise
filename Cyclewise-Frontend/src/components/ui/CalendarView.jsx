import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const CalendarView = ({
  periodDates = [],
  fertileDates = [],
  ovulationDates = [],
  onSave,
}) => {
  const [selectedRange, setSelectedRange] = useState(null); //startDate, endDate

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const dateStr = date.toDateString();

    if (
      selectedRange &&
      selectedRange.length === 2 &&
      date >= selectedRange[0] &&
      date <= selectedRange[1]
    )
      return "period-day";

    if (periodDates.some(d => d.toDateString() === dateStr)) return "period-day";
    if (fertileDates.some(d => d.toDateString() === dateStr)) return "fertile-day";
    if (ovulationDates.some(d => d.toDateString() === dateStr)) return "ovulation-day";

    return "";
  };

  const handleSubmit = () => {
    if (onSave && selectedRange && selectedRange.length === 2) {
      onSave(selectedRange);
      setSelectedRange(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 z-10 relative mt-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Calendar
          selectRange={true}
          onChange={setSelectedRange}
          value={selectedRange}
          tileClassName={tileClassName}
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleSubmit}
        disabled={!selectedRange || selectedRange.length !== 2}
        className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Save Period Range
      </motion.button>

      <div className="flex gap-4 text-sm mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600" /> Period
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-300 opacity-40" /> Fertile
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-400 opacity-40" /> Ovulation
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

