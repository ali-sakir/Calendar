import React, { useState } from 'react';
import './Calendar.css';

// Helper function to generate the days of the month
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

// Helper function to get the day of the week of the 1st day of the month
const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

// Generate a matrix of dates for the calendar
const generateCalendarMatrix = (year: number, month: number) => {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month + 1);

    console.log(firstDay, "firstDay")
    console.log(daysInMonth, "daysInMonth")
    const calendarMatrix = [];
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const initialDays = Array.from({ length: firstDay }, () => null);
    const filledDays = [...initialDays, ...days];
    const remainingNulls = Array.from({ length: 42 - filledDays.length }, () => null);
    // calendarMatrix.push([...initialDays, ...days]);
    calendarMatrix.push([...filledDays, ...remainingNulls]);
    return calendarMatrix;
};



const getDate = (event: React.MouseEvent<HTMLButtonElement>) => {

};


interface CalendarProps {
    year: number;
    month: number;
    day: number;
    setDay: any;
}

const Calendar: React.FC<CalendarProps> = ({ year, month, day, setDay }) => {
    // const [day, setDay] = useState<number |any | undefined>(undefined);

    const matrix = generateCalendarMatrix(year, month);

    console.log(year, month, "Year")
    console.log(matrix, "Year2")


    return (
        <div className="calendar">
            <div className="calendar-header">
                <div className="calendar-day">Sun</div>
                <div className="calendar-day">Mon</div>
                <div className="calendar-day">Tue</div>
                <div className="calendar-day">Wed</div>
                <div className="calendar-day">Thu</div>
                <div className="calendar-day">Fri</div>
                <div className="calendar-day">Sat</div>
            </div>
            {matrix.map((week, i) => (
                <div key={i} className="calendar-week">
                    {week.map((day, j) => (

                        <button key={j} className={`calendar-day-cell ${day ? '' : 'empty'}`}
                            onClick={() => setDay(day)}
                            disabled={day === null}
                        >

                            {day || 'X'}
                        </button>

                    ), console.log('hello'))}
                </div>
            ))}
        </div>
    );
};

export default Calendar;
