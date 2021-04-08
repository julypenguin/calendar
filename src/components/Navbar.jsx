import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { getFullDate } from 'lib/datetime'
import Calendar from './Calendar'
import SelectorM from './SelectorM'

const Navbar = ({
    showData,
    setShowData,
    renderDate,
}) => {
    const [previewData, setPreviewData] = useState(new Date())
    const [showCalendar, setShowCalendar] = useState(false)

    const selectMonthRef = useRef()

    const onClose = () => {
        setShowCalendar(false)
        setPreviewData(showData)
    }

    const getMonth = (data) => {
        const fullDate = getFullDate(data)
        return <>
            <span className='mr-1 text-lg'>{fullDate.y}</span>
            <span className='text-lg'>
                <FormattedDate
                    value={`${fullDate.y}-${fullDate.m}`
                    }
                    month="numeric"
                />
            </span>
        </>
    }

    const setMonth = (setData, data, calc) => {
        const todayToFullDate = getFullDate()
        const todayY = Number(todayToFullDate.y)
        const todayM = Number(todayToFullDate.m)
        const todayD = todayToFullDate.d
        if (!calc && calc !== 0) {
            const newShowDate = `${todayY}-${todayM}-${todayD}`
            if (typeof setData === 'function') setData(newShowDate)
            return
        }
        const fullDate = getFullDate(data)

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
        if (typeof setData === 'function') setData(newShowDate)
    }

    const detectPosition = () => {
        const input = selectMonthRef.current
        const ele = input.getBoundingClientRect()
        if (window.innerHeight - ele.top > 310) return { top: ele.bottom + 2, left: ele.left, zIndex: 6666666 }
        else return { top: ele.top + ele.height, right: ele.left, zIndex: 6666666, width: '219px', height: '215.7px' }
    }

    useEffect(() => {
        if (showData) setPreviewData(showData)
    }, [showData])

    return (
        < div className='flex justify-between bg-gray-100 select-none' >
            <ul className='flex py-2'>
                <li
                    className='p-2 mx-1 cursor-pointer hover:bg-gray-200 flex text-lg flex-shrink-0 text-blue-700'
                    onClick={() => setMonth(setShowData, showData)}
                >
                    <span className='flex items-center mr-2 text-blue-700'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </span>
                    <FormattedMessage id='calendar.today' />
                </li>
                <li
                    className='p-2 px-4 mx-1 cursor-pointer hover:bg-gray-200 flex-shrink-0'
                    onClick={() => setMonth(setShowData, showData, -1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </li>
                <li
                    className='p-2 px-4 mx-1 cursor-pointer hover:bg-gray-200 flex-shrink-0 relative'
                    onClick={() => setMonth(setShowData, showData, 1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
                    className={`p-2 mx-1 cursor-pointer text-gray-300 hover:bg-gray-200 flex-shrink-0 rounded-sm ${!showCalendar ? '' : 'bg-blue-100'}`}
                    onClick={() => setShowCalendar(!showCalendar)}
                    ref={selectMonthRef}
                >
                    <span className='mr-2 text-blue-700'>{getMonth(showData)}</span>
                    <Icon icon='chevron-down' />
                </li>
            </ul>
            <ul className='flex py-2'>
                <li className='p-2 mx-1 cursor-pointer flex items-center text-gray-300 hover:bg-gray-200 flex-shrink-0'>
                    <span className='w-5 h-5 mr-2 text-blue-700'>
                        <Icon style={{ width: '100%', height: '100%' }} icon={['far', 'calendar-alt']} />
                    </span>
                    <span className='mr-2 text-lg text-blue-700'>
                        <FormattedMessage id='calendar.month' />
                    </span>
                    <Icon icon='chevron-down' />
                </li>
            </ul>


            {!showCalendar ? null : createPortal(
                <div className={`fixed h-full w-full top-0`}>
                    <div className='fixed h-full w-full top-0 left-0' onClick={() => onClose()}></div>
                    <div
                        className={`absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-10 transition ease-out duration-75 flex`}
                        style={detectPosition()}
                    >
                        <div className='flex flex-col p-2 pb-5' style={{ width: '219px', height: '215.7px' }}>
                            <div className='flex justify-between'>
                                <div className='flex justify-center items-center px-2'>{getMonth(previewData)}</div>
                                <ul className='flex'>
                                    <li
                                        className='p-1 cursor-pointer hover:bg-gray-200 flex-shrink-0'
                                        onClick={() => setMonth(setPreviewData, previewData, -1)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </li>
                                    <li
                                        className='p-1 cursor-pointer hover:bg-gray-200 flex-shrink-0 relative'
                                        onClick={() => setMonth(setPreviewData, previewData, 1)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </li>
                                </ul>
                            </div>
                            <div className='flex-1'>
                                <Calendar
                                    showData={previewData}
                                    setShowData={setPreviewData}
                                    renderDate={renderDate}
                                    abbr
                                    textSm
                                    center
                                    selector
                                />
                            </div>
                        </div>
                        <div className='top-0 border-r'></div>
                        <SelectorM />
                    </div>
                </div>,
                document.body
            )}
        </div >

    );
};

export default Navbar;