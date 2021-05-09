import React, { useEffect, useState, useRef } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { renderFullDate, colorMap, weeks } from './formateDate'
import { getFullDate, addDays, getCycleDays, filterDate, dateDiff, addMinutes } from 'lib/datetime'
import EditorNote from './EditorNote'
import Modal from './Modal'
import { brightness } from 'lib/color'

const CalendarD = (props) => {
    const { showData, isWeek, cycle, calendarData } = props

    const [days, setDays] = useState(1)
    const [selectedDate, setSelectedDate] = useState({})
    const [showEditor, setShowEditor] = useState(false)
    const [newCalendarData, setNewCalendarData] = useState([])

    const timeRef = useRef()
    const showDaysRef = useRef()

    const hourArr = new Array(23).fill('')
    const hourLineArr = new Array(47).fill('')

    const handleSetDataAndShowEditor = (data) => {
        setSelectedDate(data)
        setShowEditor(true)
    }

    const calcParentsHeight = (elm) => {
        if (!elm) return 0
        return elm.offsetTop + calcParentsHeight(elm.offsetParent)
    }

    const calcParentsWidth = (elm) => {
        if (!elm) return 0
        const elmWidth = elm.clientWidth
        const newElmWidth = calcParentsWidth(elm.offsetParent)

        return elmWidth > newElmWidth ? elmWidth : newElmWidth
    }

    const handleSetDate = (e) => {
        const showDaysBox = showDaysRef.current
        const dayList = getCycleDays({ date: showData, dayCount: days, isWeek })
        const clickPositionX = e.clientX
        const clickPositionY = e.clientY

        const fullWidth = showDaysBox.clientWidth // showDaysBox 全寬
        const fullHeight = showDaysBox.scrollHeight // showDaysBox 全高
        const inherentHeight = calcParentsHeight(showDaysBox) // 計算上方佔了多少高度
        const halfHourHeight = fullHeight / 48 // 
        const fullScreenWidth = calcParentsWidth(showDaysBox) // 最上層的寬度
        const showDaysBoxLeft = fullScreenWidth - fullWidth + 1 // showDaysBox 左邊的定位點
        const showDaysBoxRight = fullScreenWidth - 18 // showDaysBox 右邊的定位點，18 為滾動軸寬度
        const clickDate = Math.floor((clickPositionX - showDaysBoxLeft) / ((showDaysBoxRight - showDaysBoxLeft) / days))
        const time = Math.floor((clickPositionY - inherentHeight) / halfHourHeight)


        if (clickDate < dayList.length) {
            const btime = new Date(dayList[clickDate])
            btime.setHours(Math.floor(time / 2))
            btime.setMinutes(Math.floor((time % 2) * 30))
            handleSetDataAndShowEditor({
                sid: String(Date.now()),
                title: "",
                btime: btime,
                etime: addMinutes(60, btime),
                desc: "",
                tag_color: "#BFDBFE",
            })
        }
    }

    const calcLeftAndRight = (data, direction) => {
        if (!data) return 0
        const { btime, etime } = data
        const dayList = getCycleDays({ date: showData, dayCount: days, isWeek })
        const dateB = new Date(btime)
        const dateE = new Date(etime)
        const newDayList = dayList.map((today, index) => {
            const tomorrow = addDays(1, today)
            const isFirstDate = dateB > today && dateB < tomorrow
            const isLastDate = dateE > today && dateE < tomorrow
            const isBetweenDates = dateB < today && dateE > today

            return isFirstDate || isLastDate || isBetweenDates
        })

        const left = (100 / days) * newDayList.indexOf(true)
        const right = 100 - ((100 / days) * (newDayList.lastIndexOf(true) + 1))
        if (direction === 'right') return right
        return left
    }

    const formatCalendarData = (data) => {
        const dayList = getCycleDays({ date: showData, dayCount: days, isWeek })

        const newDatas = dayList.map((day, index) => {
            const today = new Date(day)
            const tomorrow = addDays(1, day)
            let subColumn = {} // 紀錄分鐘有幾筆資料
            let maxColumn = 0 // 紀錄最大的 sort 值

            const newData = data.reduce((acc, date, i) => {
                const dateB = new Date(date.btime)
                const dateE = new Date(date.etime)
                const between = dateB >= today && dateE < tomorrow // 有在這天的資料

                if (!between) return acc

                const fullDateB = getFullDate(date.btime)
                const fullDateE = getFullDate(date.etime)
                let minuteB = Number(fullDateB.h) * 60 + Number(fullDateB.mm)
                const minuteE = Number(fullDateE.h) * 60 + Number(fullDateE.mm)

                for (minuteB; minuteB <= minuteE; minuteB++) {
                    subColumn[minuteB] = subColumn[minuteB] ? [...subColumn[minuteB], date.sid] : [date.sid]
                }

                let sort = 0
                for (let minute in subColumn) {
                    const newSort = subColumn[minute].indexOf(date.sid)
                    if (newSort > sort) sort = newSort
                    if ( newSort + 1 > maxColumn) maxColumn = newSort + 1
                }

                return [
                    ...acc,
                    {
                        ...date,
                        column: index,
                        index: i,
                        sort,
                    }
                ]
            }, [])

            return newData.map(date => ({ ...date, maxColumn }))
        })
        .filter(date => date[0])
        .flat()

        return newDatas
    }

    const renderTime = (index) => {
        const time = (index % 12) + 1
        const twelveHourClock = (index / 12) >= 1 ? 'pm' : 'am'
        return (
            <>
                <span className='calendar-time-text flex-shrink-0'><FormattedMessage id={`calendar.${twelveHourClock}`} /></span>
                <span className='calendar-time-num flex-shrink-0'>{time}</span>
            </>
        )
    }

    const renderTitleNote = () => {
        const moreDayList = newCalendarData.filter((d) => dateDiff({ ...d })) || []
        return moreDayList.map((data, index, arr) => {
            const { tag_color: hexColor } = data
            const tag_color = colorMap[hexColor]
            return (
                <div
                    key={index}
                    style={{ height: `${(arr.length * 30) + 8}px` }}
                    onClick={() => handleSetDataAndShowEditor(data)}
                >
                    <div draggable='true'>
                        <div
                            className={`calendar-day-title-note absolute cursor-pointer flex items-center ${tag_color ? `bg-${tag_color}-hover border-${tag_color} text-${tag_color}` : 'bg-blue border-blue text-blue'}`}
                            style={{
                                left: `${calcLeftAndRight(data, 'left')}%`,
                                right: `${calcLeftAndRight(data, 'right')}%`,
                                top: `${30 * index}px`,
                            }}
                        >
                            {data.title}
                        </div>
                    </div>
                </div>
            )
        })
    }

    const renderDaysTitle = (days, calendarData) => {
        const dayList = getCycleDays({ date: showData, dayCount: days, isWeek })
        const moreDayList = calendarData && calendarData.filter((d) => dateDiff({ ...d })) || []
        return dayList.map((data, index) => {
            if (calendarData && !moreDayList.length) return null
            return (
                <div
                    key={index}
                    className={`calendar-day-title flex-col flex-shrink-0`}
                    style={{ flexBasis: `${(100 / days).toFixed(4)}%` }}
                >
                    <div className='flex flex-row flex-nowrap items-end' style={{ padding: `${calendarData ? '' : '10px 0 0 10px'}`, marginBottom: `${calendarData ? '' : '8px'}` }}>
                        {moreDayList.length ? null :
                            <>
                                <div className='whitespace-nowrap overflow-hidden' style={{ marginRight: '8px', flex: '0 0 auto' }}>{renderFullDate({ data: data, noYear: true, noMonth: true, className: 'calendar-day-title-date' })}</div>
                                <div className='calendar-day-title-weekname'>{weeks[index].week_name}</div>
                            </>
                        }
                    </div>
                </div>
            )
        })
    }

    const renderNote = (data) => {
        const { btime, etime, title, tag_color: hexColor, today, index } = data
        const tag_color = colorMap[hexColor]
        const tomorrow = addDays(1, today)
        if (!new Date(today).getDate()) return

        const diff = dateDiff({ btime, etime })
        if (diff) return
        if (new Date(btime) < today || new Date(etime) >= tomorrow) return
        const fullDateB = getFullDate(btime)
        const fullDateE = getFullDate(etime)
        const minuteB = Number(fullDateB.h) * 60 + Number(fullDateB.mm)
        const minuteE = Number(fullDateE.h) * 60 + Number(fullDateE.mm)
        const minutePercent = (100 / 1440).toFixed(4)
        const maxColumnPercent = (100 / data.maxColumn).toFixed(4)

        return (
            <div
                key={index}
                className={`calendar-day-note absolute cursor-pointer opacity-70 ${tag_color ? `bg-${tag_color}-hover border-${tag_color} text-${tag_color}` : 'bg-blue border-blue text-blue'}`}
                style={{
                    top: `${minutePercent * minuteB}%`,
                    bottom: `${100 - (minutePercent * minuteE)}%`,
                    left: `${data.sort * maxColumnPercent}%`,
                    right: `calc(${(data.maxColumn - data.sort - 1) * maxColumnPercent}% + 2px)`
                }}
                onClick={e => {
                    e.stopPropagation()
                    handleSetDataAndShowEditor(data)
                }}
            >
                <div className='note-title truncate'>
                    {title}
                </div>
            </div>
        )
    }

    const renderColumnNote = ({ btime, etime, title, tag_color: hexColor, today, all_day, index }) => {
        const tag_color = colorMap[hexColor]
        const tomorrow = addDays(1, today)
        const dateB = new Date(btime)
        const dateE = new Date(etime)
        const isFirstDate = dateB > today && dateB < tomorrow
        const isLastDate = dateE > today && dateE < tomorrow
        const isBetweenDates = dateB < today && dateE > today

        if (!isFirstDate && !isLastDate && !isBetweenDates) return

        const fullDateB = getFullDate(btime)
        const fullDateE = getFullDate(etime)
        const minuteB = Number(fullDateB.h) * 60 + Number(fullDateB.mm)
        const minuteE = Number(fullDateE.h) * 60 + Number(fullDateE.mm)
        const minutePercent = (100 / 1440).toFixed(4)

        let top = isFirstDate ? `${minutePercent * minuteB}` : '0'
        let bottom = isLastDate ? `${100 - (minutePercent * minuteE)}` : '0'

        if (all_day) {
            top = '0'
            bottom = '0'
        }

        return (
            <div
                key={index}
                className='absolute left-0 top-0 bottom-0 right-0'
            // style={{ minWidth: '6px' }}
            >
                <div draggable='true'>
                    <div
                        key={index}
                        className={`absolute opacity-70 w-full ${tag_color ? `bg-${tag_color}` : 'bg-blue'}`}
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
        const dayList = getCycleDays({ date: showData, dayCount: days, isWeek })
        const onlyOneDayList = newCalendarData.filter((d) => !dateDiff({ ...d }))
        const formatOneDayList = formatCalendarData(onlyOneDayList)
        const moreDayList = newCalendarData.filter((d) => dateDiff({ ...d }))
        return dayList.map((data, index) => (
            <div
                key={index}
                className='calendar-day-notes relative flex-shrink-0'
                style={{ flexBasis: `${(100 / days).toFixed(4)}%` }}
            >

                {moreDayList.map((dataDetail, index) => renderColumnNote({ ...dataDetail, today: data, index }))}

                <div className='absolute left-0 top-0 bottom-0' style={{ right: '10px', minWidth: '6px' }}>
                    <div draggable='true'>
                        {formatOneDayList.map((dataDetail, index) => renderNote({ ...dataDetail, today: data, index }))}
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

    useEffect(() => {
        if (calendarData) {
            const newData = calendarData && calendarData.data.filter((date) => filterDate({ ...props, ...date, dayCount: days })) || []
            setNewCalendarData(newData)
        }
    }, [calendarData, days, showData])

    return (
        <div className="relative flex flex-1 w-full h-full">
            {/* 大月曆(日) */}
            <div className="inset-0 absolute flex flex-col">
                {/* 日期、星期 */}
                <div className='flex flex-shrink-0'>
                    <div className='flex flex-shrink-0 bg-white'>
                        <div className='calendar-day-title-left-space text-center whitespace-nowrap flex flex-col flex-end'></div>
                    </div>
                    <div className='calendar-day-title-right overflow-hidden flex-1'>
                        <div className='flex'>{renderDaysTitle(days)}</div>
                        <div className='flex relative border-b-2'>
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
                                            <div className='flex flex-nowrap'>
                                                {renderTime(index)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className='calendar-day-notes-line relative flex flex-1'
                        onScroll={onScroll}
                        ref={showDaysRef}
                        onClick={e => handleSetDate(e)}
                    >
                        <div className='flex flex-1' style={{ height: '1440px' }}>
                            <div
                                className='relative flex flex-1 w-full'
                            >
                                {hourLineArr.map((line, index) => (
                                    <div
                                        key={index}
                                        className={`absolute left-0 right-0 border-t ${index % 2 === 1 ? 'border-solid' : 'border-dashed'}`}
                                        style={{ top: `${(100 / 48) * (index + 1)}%` }}
                                    />
                                ))}

                                {renderNotes(days)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Modal
                Content={EditorNote}
                show={showEditor}
                handleClose={() => setShowEditor(false)}
                defaultValue={selectedDate}
                setDefaultValue={setSelectedDate}
                calendarData={newCalendarData}
                setCalendarData={setNewCalendarData}
            />
        </div>
    );
};

export default CalendarD;