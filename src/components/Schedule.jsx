import React, { useEffect } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'

import { getFullDate, filterDate, addMinutes } from 'lib/datetime'
import { renderFullDate, calendarType, colorMap } from './formatDate'
import { weeks } from './formatDate'

const Schedule = (props) => {
    const {
        calendarData, // 從外部填入日曆的資料
        showData, // 一個日期
        handleClose,
        showEditor,
        setShowEditor,
        setSelectedDate,
    } = props

    const newCalendarData = calendarData && calendarData
        .filter((date) => filterDate({ ...date, showData, dayCount: 1 }))
        .sort(function (a, b) {
            return new Date(a.btime) - new Date(b.btime)
        })
        || []

    const onClose = () => {
        if (typeof handleClose === 'function') handleClose()
    }

    const handleSetDataAndShowEditor = (data) => {
        setSelectedDate(data)
        setShowEditor(true)
    }

    // 計算開始到結束共有多久
    const calcDays = (btime, etime, all_day) => {
        if (all_day) return (
            <FormattedMessage id='calendar.all_day' />
        )
        const dateB = new Date(btime)
        const dateD = new Date(etime)
        if (!dateB.getDate() || !dateD.getDate()) return 0
        const oneMinutesMsec = 60 * 1000
        const oneHoursMsec = 60 * oneMinutesMsec
        const oneDayMsec = 24 * oneHoursMsec
        const diffMsec = dateD - dateB
        const diffDays = Math.floor(diffMsec / oneDayMsec)
        const diffHours = Math.floor((diffMsec % oneDayMsec) / oneHoursMsec)
        const diffMinutes = Math.floor((diffMsec % oneDayMsec) % oneHoursMsec / oneMinutesMsec)
        return (
            <>
                {!diffDays ? null :
                    <>
                        {diffDays} <FormattedMessage id='calendar.days' /><span className='mr-1' />
                    </>
                }

                {!diffHours ? null :
                    <>
                        {diffHours} <FormattedMessage id='calendar.hours' /><span className='mr-1' />
                    </>
                }

                {!diffMinutes ? null :
                    <>
                        {diffMinutes} <FormattedMessage id='calendar.minutes' />
                    </>
                }

                {!diffDays && !diffHours && !diffMinutes &&
                    <>
                        {diffMinutes} <FormattedMessage id='calendar.minutes' />
                    </>
                }
            </>
        )
    }

    return (
        <div className='border-l hidden md:flex flex-col bg-white'>
            <div
                className='flex flex-col h-full'
                style={{ width: '320px', minWidth: '320px', maxHeight: 'calc(100vh - 70px)' }}
            >
                <div className='flex flex-auto h-full overflow-y-auto overflow-x-hidden'>
                    <div className='overflow-hidden flex flex-col w-full'>
                        <div
                            className='pl-3 border-b flex flex-row flex-nowrap items-center justify-between overflow-hidden'
                            style={{ height: '46px', minHeight: '46px' }}
                        >
                            <div className='flex flex-row items-center h-full'>
                                {renderFullDate({ data: showData, noYear: true })}
                                <span className='mx-1'>(</span>
                                {weeks[new Date(showData).getDay()] && weeks[new Date(showData).getDay()]['week_name']}
                                <span className='mx-1'>)</span>
                            </div>
                            <div
                                className='flex items-center'
                            >
                                <span
                                    // className='flex flex-shrink-0 text-blue-600 border border-blue-600 rounded-lg px-2 mr-2 bg-blue-50 cursor-pointer hover:bg-blue-100'
                                    className='flex flex-shrink-0 text-white bg-blue-600 rounded mr-2 cursor-pointer hover:bg-blue-700'
                                    onClick={() => handleSetDataAndShowEditor({
                                        sid: String(Date.now()),
                                        title: "",
                                        btime: showData,
                                        etime: addMinutes(60, showData),
                                        desc: "",
                                        tag_color: "#BFDBFE",
                                    })}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    {/* <span>新增</span> */}
                                </span>
                                <span
                                    className='p-2 mr-2 flex items-center cursor-pointer hover:bg-gray-100'
                                    onClick={onClose}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div
                            className='overflow-x-hidden overscroll-y-auto h-full'
                        >
                            {newCalendarData && !newCalendarData.length ?

                                <div className='flex flex-col flex-auto h-full justify-center items-center text-lg text-bold'>
                                    <FormattedMessage id='calendar.no_plans_today' />
                                </div>

                                :

                                <div className='flex flex-col min-h-0 flex-auto h-full'>

                                    {newCalendarData.map((schedule, index) => (
                                        <div
                                            key={index}
                                            className='px-4 py-2 flex cursor-pointer hover:bg-gray-100'
                                            onClick={() => handleSetDataAndShowEditor(schedule)}
                                        >
                                            <div className={`border-l-4 mr-2 rounded-sm ${colorMap[schedule.tag_color] ? `border-${colorMap[schedule.tag_color]}` : 'border-blue'}`} />
                                            <div className='flex flex-col py-2 w-full'>
                                                <div className='flex mb-1'>
                                                    <div className='text-xs truncate mr-1' style={{ width: '58px' }}>
                                                        <FormattedTime value={schedule.btime} />
                                                    </div>
                                                    <div className='truncate flex-1'>
                                                        <div className='text-xs truncate pr-2'>{schedule.title}</div>
                                                    </div>
                                                </div>
                                                <div className='text-xs'>{calcDays(schedule.btime, schedule.etime, schedule.all_day)}</div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;