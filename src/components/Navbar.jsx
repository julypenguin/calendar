import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { getFullDate } from 'lib/datetime'
import CalendarM from './CalendarM'
import SelectorM from './SelectorM'
import { renderFullDate, calendarType } from './formateDate'

const Navbar = ({
    showData,
    setShowData,
    renderDate,
    cycle,
    setCycle,
}) => {
    const [previewData, setPreviewData] = useState(new Date())
    // const [cycle, setCycle] = useState(30) // 1: 1天, 2:2天, 3:3天, 4:4天, 5:5天, 6:6天, 7:7天, 30: 1月, 77:1週
    const [showCalendar, setShowCalendar] = useState(false)
    const [showCycle, setShowCycle] = useState(false)

    const selectMonthRef = useRef()
    const selectCycleRef = useRef()
    const outerRef = useRef()

    const cycleList = [0, 77, 30]

    const onClose = () => {
        setShowCalendar(false)
        setShowCycle(false)
        setPreviewData(showData) // 回到未選擇的這天
    }

    const selectCycle = (mode) => {
        setCycle(mode)
        onClose()
    }

    const handleSetDate = (calc) => {
        if (cycle === 30) return setMonth(setShowData, showData, calc)
        if (cycle === 77) return setDate(setShowData, showData, calc * 7)
        setDate(setShowData, showData, calc)
    }

    const setDate = (setData, data, calc) => {
        const fullDate = getFullDate(data)
        const date = new Date(data)
        date.setDate(Number(fullDate.d) + calc)
        if (typeof setData === 'function') setData(date)
        return
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

    const detectPosition = (ref, rightAndBottom, parentRef) => {
        if (!ref) return {}
        const elementRef = ref.current
        const ele = elementRef.getBoundingClientRect()
        let parentEle = parentRef && parentRef.current && parentRef.current.getBoundingClientRect()

        if (rightAndBottom && parentEle) {
            return { top: ele.bottom, right: parentEle.right - ele.right, zIndex: 6666666 }
        }
        if (window.innerHeight - ele.top > 310) return { top: ele.bottom + 2, left: ele.left, zIndex: 6666666 }
        else return { top: ele.top + ele.height, right: ele.left, zIndex: 6666666, width: '219px', height: '215.7px' }
    }

    const renderCycleList = (mode, index) => {
        return (
            <li
                key={index}
                className='pl-2 py-2 cursor-pointer hover:bg-gray-200 flex flex-shrink-0 items-center'
                style={{ paddingRight: '13.13px' }}
                onClick={() => mode === 0 ? selectCycle(mode + 1) : selectCycle(mode)}
            >
                <span className='block w-5 h-5 mr-2 text-blue-700'>
                    <Icon style={{ width: '100%', height: '100%' }} icon={['far', 'calendar-alt']} />
                </span>
                <span className='mr-2 text-lg text-blue-700 flex-shrink-0'>
                    {calendarType[mode]}
                    {/* <FormattedMessage id='calendar.day' /> */}
                </span>

            </li>
        )
    }

    useEffect(() => {
        if (showData) setPreviewData(showData)
    }, [showData])

    return (
        < div className='flex justify-between bg-gray-100 select-none' ref={outerRef}>
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
                    onClick={() => handleSetDate(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </li>
                <li
                    className='p-2 px-4 mx-1 cursor-pointer hover:bg-gray-200 flex-shrink-0 relative'
                    onClick={() => handleSetDate(1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </li>
                <li
                    className={`p-2 mx-1 cursor-pointer text-gray-300 hover:bg-gray-200 flex-shrink-0 rounded-sm ${!showCalendar ? '' : 'bg-blue-100'}`}
                    onClick={() => setShowCalendar(!showCalendar)}
                    ref={selectMonthRef}
                >
                    <span className='mr-2 text-blue-700'>
                        {cycle === 77 && renderFullDate({ data: showData, noDate: true, rangeDtoWeek: true })} {cycle === 30 && renderFullDate({ data: showData, noDate: true })}
                        {cycle > 0 && cycle < 8 && renderFullDate({ data: showData })}
                    </span>
                    <Icon icon='chevron-down' />
                </li>
            </ul>
            <ul className='flex py-2'>
                <li
                    className='p-2 mx-1 cursor-pointer flex items-center text-gray-300 hover:bg-gray-200 flex-shrink-0'
                    onClick={() => setShowCycle(!showCycle)}
                    ref={selectCycleRef}
                >
                    <span className='w-5 h-5 mr-2 text-blue-700'>
                        <Icon style={{ width: '100%', height: '100%' }} icon={['far', 'calendar-alt']} />
                    </span>
                    <span className='mr-2 text-lg text-blue-700'>
                        {calendarType[cycle]}
                        {/* <FormattedMessage id='calendar.month' /> */}
                    </span>
                    <Icon icon='chevron-down' />
                </li>
            </ul>


            {!showCalendar ? null : createPortal(
                <div className={`fixed h-full w-full top-0`}>
                    <div className='fixed h-full w-full top-0 left-0' onClick={() => onClose()}></div>
                    <div
                        className={`absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-10 transition ease-out duration-75 flex`}
                        style={detectPosition(selectMonthRef)}
                    >
                        {cycle === 30 ? null : <div className='flex flex-col p-2 pb-5' style={{ width: '219px', height: '215.7px' }}>
                            <div className='flex justify-between select-none'>
                                <div className='flex justify-center items-center px-2'>{renderFullDate({ data: previewData, noDate: true })}</div>
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
                                <CalendarM
                                    showData={previewData}
                                    setShowData={setPreviewData}
                                    renderDate={renderDate}
                                    setOtherData={setShowData}
                                    onClose={onClose}
                                    abbr
                                    textSm
                                    center
                                    selector
                                />
                            </div>
                        </div>}
                        <div className='top-0 border-r'></div>
                        <SelectorM
                            month={renderFullDate({ data: previewData, noMonth: true, noDate: true })}
                            renderFullDate={renderFullDate}
                            defaultData={previewData}
                            setDefaultData={setPreviewData}
                            setOtherData={setShowData}
                            onClose={onClose}
                            cycle={cycle}
                        />
                    </div>
                </div>,
                document.body
            )}

            {!showCycle ? null : createPortal(
                <div className={`fixed h-full w-full top-0`}>
                    <div className='fixed h-full w-full top-0 left-0' onClick={() => onClose()}></div>
                    <div
                        className={`absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-10 transition ease-out duration-75 flex`}
                        style={detectPosition(selectCycleRef)}
                    >
                        <div className='flex flex-col select-none'>
                            <ul className='flex flex-col'>
                                {cycleList.map((data, index) => renderCycleList(data, index))}
                            </ul>
                        </div>
                        <div className='top-0 border-r'></div>
                    </div>
                </div>,
                document.body
            )}
        </div >

    );
};

export default Navbar;