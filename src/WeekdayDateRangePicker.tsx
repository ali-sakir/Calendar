import React, { useState, useRef, useEffect } from "react";

interface DateRangePickerProps {
  onChange: (dateRange: string[], weekends: string[]) => void;
  predefinedRanges?: { label: string; range: [Date, Date] }[];
}

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

const getWeekendsInRange = (start: Date, end: Date): string[] => {
  const weekends: string[] = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    if (isWeekend(currentDate)) {
      weekends.push(formatDate(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return weekends;
};

const WeekdayDateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  predefinedRanges,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDateClick = (date: Date) => {
    if (isWeekend(date)) return; // Prevent selection of weekends

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate && date > startDate) {
      setEndDate(date);
      const weekends = getWeekendsInRange(startDate, date);
      onChange([formatDate(startDate), formatDate(date)], weekends);
      setIsCalendarOpen(false); // Close calendar when selection is complete
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays: JSX.Element[] = [];

    // Weekdays heading (Su Mo Tu We Th Fr Sa)
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    calendarDays.push(
      <div key="weekdays" className="calendar-row calendar-header">
        {weekdays.map((day) => (
          <div key={day} className="calendar-cell">{day}</div>
        ))}
      </div>
    );

    // Prepare array of all days in the month, along with empty cells at the start for alignment
    let days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-cell empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected =
        (startDate && formatDate(startDate) === formatDate(date)) ||
        (endDate && formatDate(endDate) === formatDate(date));
      const isInRange =
        startDate && endDate && date > startDate && date < endDate;
      const isWeekendDay = isWeekend(date);

      days.push(
        <div
          key={day}
          className={`calendar-cell ${isWeekendDay ? "weekend" : ""} ${
            isSelected ? "selected" : ""
          } ${isInRange ? "in-range" : ""}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </div>
      );

      // Push the row every time we have 7 days (one week)
      if (days.length === 7) {
        calendarDays.push(
          <div key={`row-${day}`} className="calendar-row">
            {days}
          </div>
        );
        days = [];
      }
    }

    // Push any remaining days that didn't fill up a full week
    if (days.length > 0) {
      calendarDays.push(
        <div key="last-row" className="calendar-row">
          {days}
        </div>
      );
    }

    return calendarDays;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(currentYear - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(currentYear + 1);
  };

  const handlePredefinedRange = (range: [Date, Date]) => {
    const [start, end] = range;
    setStartDate(start);
    setEndDate(end);
    const weekends = getWeekendsInRange(start, end);
    onChange([formatDate(start), formatDate(end)], weekends);
    setIsCalendarOpen(false); // Close calendar after selection
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div className="date-picker-container" ref={calendarRef}>
      <input
        type="text"
        placeholder="Select date range"
        onFocus={() => setIsCalendarOpen(true)}
        value={
          startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : ""
        }
        readOnly
      />

      {isCalendarOpen && (
        <div className="date-range-picker">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>{"<"}</button>
            <span>{`${currentYear}-${currentMonth + 1}`}</span>
            <button onClick={handleNextMonth}>{">"}</button>
          </div>
          <div className="calendar-grid">{renderCalendar()}</div>

          {predefinedRanges && (
            <div className="predefined-ranges">
              {predefinedRanges.map((range) => (
                <button key={range.label} onClick={() => handlePredefinedRange(range.range)}>
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeekdayDateRangePicker;
