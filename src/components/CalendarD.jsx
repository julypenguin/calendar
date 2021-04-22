import React, { useEffect, useState, useRef } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { renderFullDate } from './formateDate'
import { getFullDate, addDays, getCycleDays, filterDate, dateDiff } from 'lib/datetime'
import { weeks } from './formateDate'

const CalendarD = (props) => {
    const { showData, isWeek, cycle, calendarData } = props
    const [days, setDays] = useState(1)

    const timeRef = useRef()

    const hourArr = new Array(23).fill('')
    const hourLineArr = new Array(47).fill('')

    const newCalendarData = calendarData && calendarData.data.filter((date) => filterDate({ ...props, ...date, dayCount: days })) || []

    const calcLeftAndRight = (data, direction) => {
        if (!data) return 0
        const { btime, etime } = data
        const dayArr = getCycleDays({ date: showData, dayCount: days, isWeek })
        const dateB = new Date(btime)
        const dateE = new Date(etime)
        const newDayArr = dayArr.map((today, index) => {
            const tomorrow = addDays(1, today)
            const isFirstDate = dateB > today && dateB < tomorrow
            const isLastDate = dateE > today && dateE < tomorrow
            const isBetweenDates = dateB < today && dateE > today

            return isFirstDate || isLastDate || isBetweenDates
        })

        const left = (100 / days) * newDayArr.indexOf(true)
        const right = 100 - ((100 / days) * (newDayArr.lastIndexOf(true) + 1))
        if (direction === 'right') return right
        return left
    }

    const renderTime = (index) => {
        const time = (index % 12) + 1
        const twelveHourClock = (index / 12) >= 1 ?  'pm' : 'am'
        return (
            <>
                <span className='mr-1 text-xs flex-shrink-0'><FormattedMessage id={`calendar.${twelveHourClock}`} /></span>
                <span className='text-xs flex-shrink-0'>{time}</span>
            </>
        )
    }

    const renderTitleNote = () => {
        const moreDayArr = newCalendarData.filter((d) => dateDiff({ ...d })) || []
        return moreDayArr.map((data, index, arr) => (
            <div key={index} style={{ height: `${(arr.length * 30) + 8}px` }}>
                <div draggable='true'>
                    <div
                        className={`absolute cursor-pointer px-2 flex items-center border-l-4 opacity-70 ${data.tag_color ? `bg-${data.tag_color}-200 border-${data.tag_color}-600 hover:bg-${data.tag_color}-300 text-${data.tag_color}-800` : 'bg-blue-200 border-blue-600 hover:bg-blue-300 text-blue-800'}`}
                        style={{ height: '29px', marginTop: '4px', marginRight: '12px', marginBottom: '4px', left: `${calcLeftAndRight(data, 'left')}%`, right: `${calcLeftAndRight(data, 'right')}%`, top: `${30 * index}px` }}
                    >
                        {data.title}
                    </div>
                </div>
            </div>
        ))
    }

    const renderDaysTitle = (days, calendarData) => {
        const dayArr = getCycleDays({ date: showData, dayCount: days, isWeek })
        const moreDayArr = calendarData && calendarData.filter((d) => dateDiff({ ...d })) || []
        return dayArr.map((data, index) => {
            if (calendarData && !moreDayArr.length) return null
            return (
                <div
                    key={index}
                    className={`mr-0 border-r border-l flex-col flex-shrink-0 ${calendarData ? 'border-b-2' : ''}`}
                    style={{ flexBasis: `${(100 / days).toFixed(4)}%` }}
                >
                    <div className='flex flex-row flex-nowrap items-end' style={{ padding: `${calendarData ? '' : '10px 0 0 10px'}`, marginBottom: `${calendarData ? '' : '8px'}` }}>
                        {moreDayArr.length ? null :
                            <>
                                <div className='whitespace-nowrap overflow-hidden' style={{ marginRight: '8px', flex: '0 0 auto' }}>{renderFullDate({ data: data, noYear: true, noMonth: true, className: 'text-2xl' })}</div>
                                <div className='' style={{ marginBottom: '2px' }}>{weeks[index].week_name}</div>
                            </>
                        }
                    </div>

                </div>
            )
        })
    }

    const renderNote = ({ btime, etime, title, tag_color, today, index }) => {
        const tomorrow = addDays(1, today)

        if (!new Date(today).getDate()) return

        const diff = dateDiff({ btime, etime })
        if (diff) return
        if (new Date(btime) < today || new Date(etime) >= tomorrow) return
        const fullDateB = getFullDate(btime)
        const fullDateE = getFullDate(etime)
        const minB = Number(fullDateB.h) * 60 + Number(fullDateB.mm)
        const minE = Number(fullDateE.h) * 60 + Number(fullDateE.mm)
        const secPercent = (100 / 1440).toFixed(4)

        return (
            <div
                key={index}
                className={`absolute cursor-pointer opacity-70 box-border border-l-4 w-full ${tag_color ? `bg-${tag_color}-200 border-${tag_color}-600 hover:bg-${tag_color}-300 text-${tag_color}-800` : 'bg-blue-200 border-blue-600 hover:bg-blue-300 text-blue-800'}`}
                style={{ inset: `${secPercent * minB}% 0% ${100 - (secPercent * minE)}%` }}
            >
                <div className='p-1'>
                    {title}
                </div>
            </div>
        )
    }

    const renderColumnNote = ({ btime, etime, title, tag_color, today, index }) => {
        const tomorrow = addDays(1, today)
        const dateB = new Date(btime)
        const dateE = new Date(etime)
        const isFirstDate = dateB > today && dateB < tomorrow
        const isLastDate = dateE > today && dateE < tomorrow
        const isBetweenDates = dateB < today && dateE > today

        if (!isFirstDate && !isLastDate && !isBetweenDates) return

        const fullDateB = getFullDate(btime)
        const fullDateE = getFullDate(etime)
        const minB = Number(fullDateB.h) * 60 + Number(fullDateB.mm)
        const minE = Number(fullDateE.h) * 60 + Number(fullDateE.mm)
        const secPercent = (100 / 1440).toFixed(4)

        const top = isFirstDate ? `${secPercent * minB}` : '0'
        const bottom = isLastDate ? `${100 - (secPercent * minE)}` : '0'

        return (
            <div
                key={index}
                className='absolute left-0 top-0 bottom-0'
                style={{ right: '0px', minWidth: '6px' }}
            >
                <div draggable='true'>
                    <div
                        key={index}
                        className={`absolute opacity-70 w-full ${tag_color ? `bg-${tag_color}-200` : 'bg-blue-200'}`}
                        style={{ inset: `${top}% 0% ${bottom}%` }}
                    >
                        <div className='p-1'>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderNotes = (days) => {
        const dayArr = getCycleDays({ date: showData, dayCount: days, isWeek })
        const onlyOneDayArr = newCalendarData.filter((d) => !dateDiff({ ...d }))
        const moreDayArr = newCalendarData.filter((d) => dateDiff({ ...d }))
        return dayArr.map((data, index) => (
            <div key={index} className='border-l border-r relative border-box flex-shrink-0' style={{ minWidth: '80px', flexBasis: `${(100 / days).toFixed(4)}%` }}>

                {moreDayArr.map((dataDetail, index) => renderColumnNote({ ...dataDetail, today: data, index }))}

                <div className='absolute left-0 top-0 bottom-0' style={{ right: '10px', minWidth: '6px' }}>
                    <div draggable='true'>
                        {onlyOneDayArr.map((dataDetail, index) => renderNote({ ...dataDetail, today: data, index }))}
                    </div>
                </div>

            </div>
        ))
    }

    // 讓時間區也一起滾動
    const onScroll = e => {
        const element = e.target
        timeRef.current.scrollTop = element.scrollTop
    }

    useEffect(() => {
        if (cycle === 77) setDays(7)
        else if (cycle > 0 && cycle < 8) setDays(cycle)
    }, [cycle])

    return (
        <div className="relative flex flex-1 w-full h-full">
            {/* 大月曆(日) */}
            <div className="inset-0 absolute flex flex-col">
                {/* 日期、星期 */}
                <div className='flex flex-shrink-0'>
                    <div className='flex flex-shrink-0 bg-white'>
                        <div className='text-center whitespace-nowrap z-10 flex flex-col flex-end' style={{ width: '59px', padding: '10px 0 4px 0' }}></div>
                    </div>
                    <div className='overflow-hidden flex-1' style={{ paddingRight: '18px', paddingLeft: '10px', marginLeft: '-10px', minHeight: '48px', minWidth: '80px' }}>
                        <div className='flex'>{renderDaysTitle(days)}</div>
                        <div className='flex relative'>
                            {renderDaysTitle(days, newCalendarData)}
                            {renderTitleNote()}
                        </div>
                    </div>
                </div>
                {/* 行程 */}
                <div className='flex relative overflow-hidden flex-1 z-0'>
                    {/* 時間 */}
                    <div className='overflow-hidden flex-shrink-0 bg-white' ref={timeRef}>
                        <div className='flex'>
                            <div className='flex flex-shrink-0 flex-grow-0 flex-col relative' style={{ height: '1440px', width: '59px' }}>
                                {hourArr.map((data, index) => (
                                    <div key={index} className='text-right w-full absolute' style={{ top: `${(100 / 24) * (index + 1)}%` }}>
                                        <div className='relative' style={{ bottom: '8px' }}>
                                            <div className='flex flex-nowrap justify-center'>
                                                {renderTime(index)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className='relative flex flex-1'
                        style={{ paddingRight: '18px', paddingLeft: '2px', marginLeft: '-2px', overflow: 'overlay' }}
                        onScroll={onScroll}
                    >
                        <div className='flex flex-1' style={{ height: '1440px' }}>
                            <div className='relative flex flex-1 w-full'>
                                {hourLineArr.map((line, index) => (
                                    <div key={index} className={`absolute left-0 right-0 border-t ${index % 2 === 1 ? 'border-solid' : 'border-dashed'}`} style={{ top: `${(100 / 48) * (index + 1)}%` }}></div>
                                ))}

                                {renderNotes(days)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarD;