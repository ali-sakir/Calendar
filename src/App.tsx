import React, { useState } from 'react';
import Modal from './components/Modal';
import './App.css';
import WeekdayDateRangePicker from "./WeekdayDateRangePicker"
import Calendar from './components/Calendar';


const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const monthInName = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = currentDate.getMonth();

    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());
    const [day, setDay] = useState<number | any | undefined>(0);


    console.log("currentDate", currentDate);
    console.log("currentDate1", year);
    console.log("currentDate2", month);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMonth(month === 11 ? 0 : month + 1);
        if (month === 11) {
            setYear(year + 1)
        }
        if (month === 12){
            setYear(year + 1)
        }

        // togetYear();
        // setYear(month === 11 ? 0 : year + 1)

    };

    const buttonHandler2 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMonth(month === 0 ? 11 : month - 1);
        if (month === 0) {
            setYear(year - 1)
        }
        // togetYear();

        // setYear(month === 11 ? 0 : year -    1)

    };


    return (
        <div className="App">
            <h2 className='text-5xl text-center text-blue-600'>Calendar in TypeScript</h2>
            <input
            className='border-2  border-black-600 w-56 rounded mt-8 '
                type="text"
                placeholder="Click me to open calender"
                onClick={openModal}
                
                value={`${day} ${'/'} ${month+1} ${'/'} ${year}`}
            />

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className='flex justify-between'>
                <h2>Calender</h2>
                    <div className="close flex justify-end -mt-4" onClick={closeModal}>&times;</div>
                </div>

                {/* <WeekdayDateRangePicker onChange={handleDateRangeChange}  /> */}

                <div className=''>
                    <div className='flex justify-between'>
                        <button onClick={buttonHandler2} >prev</button>
                        <div>{year}</div>
                        <div>{monthInName[month]}
                            {/* {month} */}
                            </div>
                        <button onClick={buttonHandler}>next</button>
                    </div>
                    <Calendar year={year} month={month} day={day} setDay={setDay}/>
                    <div className='flex justify-between'>
                        <button onClick={buttonHandler2} >prev</button>

                        <div>{month === 11 ? year+1 : year}</div>
                        <div>{monthInName[month === 11 ? 0 : month+1]}
                            {/* {month === 11 ? 0 : month+1} */}
                            </div>

                        <button onClick={buttonHandler}>next</button>
                    </div>
                    <Calendar year={year} month={month + 1} day={day} setDay={setDay}/>
                </div>
            </Modal>
        </div>
    );
};

export default App;
