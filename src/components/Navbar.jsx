import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { getFullDate } from 'lib/datetime'
import Calendar from './Calendar'

const Navbar = ({
    showData,
    setShowData,
    renderDate,
}) => {
    const [showCalendar, setShowCalendar] = useState(false)

    const selectMonthRef = useRef()

    const getMonth = () => {
        const fullDate = getFullDate(showData)
        return <>
            <span className='mr-1 text-lg'>{fullDate.y}</span>
            <FormattedDate
                value={`${fullDate.y}-${fullDate.m}`
                }
                month="numeric"
            />
        </>
    }

    const setMonth = (calc) => {
        const todayToFullDate = getFullDate()
        const todayY = Number(todayToFullDate.y)
        const todayM = Number(todayToFullDate.m)
        const todayD = todayToFullDate.d
        if (!calc && calc !== 0) {
            const newShowDate = `${todayY}-${todayM}-${todayD}`
            setShowData(newShowDate)
            return
        }
        const fullDate = getFullDate(showData)

        let y = Number(fullDate.y)
        let m = Number(fullDate.m) + calc
        const d = (todayY === y && todayM === m) ? todayD : '1'

        if (m <= 0) {
            y = y - 1
            m = m + 12
        }

        if (m > 12) {
            y = y + 1
            m = m - 12
        }

        const newShowDate = `${y}-${m}-${d}`
        setShowData(newShowDate)
    }

    const detectPosition = () => {
        const input = selectMonthRef.current
        const ele = input.getBoundingClientRect()
        console.log('ele', ele)
        if (window.innerHeight - ele.top > 310) return { top: ele.bottom + 2, left: ele.left, zIndex: 6666666, width: '219px', height: '263px' }
        else return { top: ele.top + ele.height, right: ele.left, zIndex: 6666666, width: '500px', height: '500px' }
    }

    return (
        < div className='flex justify-between bg-gray-100 select-none' >
            <ul className='flex py-1'>
                <li
                    className='p-2 mx-1 cursor-pointer hover:bg-gray-200 flex text-lg flex-shrink-0'
                    onClick={() => setMonth()}
                >
                    <span className='flex items-center mr-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </span>
                    <FormattedMessage id='calendar.today' />
                </li>
                <li
                    className='p-2 px-4 mx-1 cursor-pointer hover:bg-gray-200 flex-shrink-0'
                    onClick={() => setMonth(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </li>
                <li
                    className='p-2 px-4 mx-1 cursor-pointer hover:bg-gray-200 flex-shrink-0 relative'
                    onClick={() => setMonth(1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    {/* {showCalendar && <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition ease-out duration-75 transform scale-95 z-10 `}>
                        <Calendar
                            showData={showData}
                            setShowData={setShowData}
                            renderDate={renderDate}
                        />
                    </div>} */}
                </li>
                <li
                    className={`p-2 mx-1 cursor-pointer hover:bg-gray-200 flex-shrink-0 rounded-sm ${!showCalendar ? '' : 'bg-blue-100'}`}
                    onClick={() => setShowCalendar(!showCalendar)}
                    ref={selectMonthRef}
                >
                    <span className='mr-2 text-lg'>{getMonth()}</span>
                    <Icon icon='chevron-down' />
                </li>
            </ul>
            <ul className='flex py-1'>
                <li className='p-2 mx-1 cursor-pointer flex items-center hover:bg-gray-200 flex-shrink-0'>
                    <span className='w-5 h-5 mr-2'>
                        <Icon style={{ width: '100%', height: '100%' }} icon={['far', 'calendar-alt']} />
                    </span>
                    <span className='mr-2 text-lg'>
                        <FormattedMessage id='calendar.month' />
                    </span>
                    <Icon icon='chevron-down' />
                </li>
            </ul>


            {!showCalendar ? null : createPortal(
                <div className={`fixed h-full w-full top-0`}>
                    <div className='fixed h-full w-full top-0 left-0' onClick={() => setShowCalendar(false)}></div>
                    <div
                        className={`absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition ease-out duration-75`}
                        style={detectPosition()}
                    // style={{ top, right }}
                    >
                        {/* <div>2021 4 月</div> */}
                        <Calendar
                            showData={showData}
                            setShowData={setShowData}
                            renderDate={renderDate}
                            abbr
                            textSm
                            center
                        />
                    </div>
                </div>,
                document.body
            )}
        </div >

    );
};

export default Navbar;