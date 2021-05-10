import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import '../styl/styles.css'
import { getFullDate, filterDate, addMinutes, dateDiff } from 'lib/datetime'
import { weeks, renderCalendarMonthDate, colorMap } from './formatDate'
import EditorNote from './EditorNote'
import SchedualDetail from './SchedualDetail'
import Schedule from './Schedule'
import Modal from './Modal'

const CalendarM = (props) => {
    const {
        showData, // 一個日期
        setShowData,
        renderDate, // 給一個日期會回傳整個月的陣列
        setOtherData,
        onClose,
        abbr, // 讓 calendar 保持所寫文字
        textSm, // 讓文字變小
        center, // 文字置中
        selector, // 點擊後會選取
        calendarData, // 從外部填入日曆的資料
        canEdit,
        isMonth,
    } = props

    const [newShowData, setNewShowData] = useState(new Date())
    const [newCalendarData, setNewCalendarData] = useState([])
    const [selectedDate, setSelectedDate] = useState({})
    const [showDetail, setShowDetail] = useState(false)
    const [showEditor, setShowEditor] = useState(false)
    const [showSchedule, setShowSchedule] = useState(true)

    const cellRef = useRef()

    const fullDate = getFullDate(newShowData)
    const weeks = renderDate(showData)

    const handleSetDate = data => {
        const newDate = new Date(data.year, data.month - 1, data.date)
        setNewShowData(newDate)

        if (typeof setOtherData === 'function') setOtherData(newDate)
        if (typeof onClose === 'function') onClose()
        if (canEdit) {
            if (selectedDate && (selectedDate.btime - newDate) === 0) {
                setShowEditor(true)
            } else {
                setShowSchedule(true)
                setSelectedDate({
                    sid: String(Date.now()),
                    title: "",
                    btime: newDate,
                    etime: addMinutes(60, newDate),
                    desc: "",
                    tag_color: "#BFDBFE",
                })
            }

        }
    }

    const handleSetDataAndShowDetail = (data) => {
        setSelectedDate(data)
        setShowDetail(true)
    }

    const formatCalendarData = (data) => {
        let subLevel = {} // 紀錄某一天有幾筆資料

        // 先把一天一天跑起來，再來看特定日子有哪幾個資料
        const newDatas = weeks.map((week, index, arr) => {
            const newWeek = week.map((day, idx) => {
                const newData = data.map((date, i) => {
                    let left = 0
                    let right = 0
                    let crossDay = false
                    const today = new Date(day.year, day.month - 1, day.date)
                    const tomorrow = new Date(day.year, day.month - 1, day.date + 1)
                    const dateB = new Date(date.btime)
                    const dateE = new Date(date.etime)

                    const before = dateB < today && dateE > today // 不只一天，今天不是第一天
                    const between = dateB >= today && dateE < tomorrow // 當天
                    const future = dateB < tomorrow && dateE > tomorrow // 不只一天，今天不是最後一天
                    const cover = dateB < today && dateE > tomorrow // 不只一天，今天不是第一天，也不是最後一天

                    // 找第一天
                    if (future && !cover) {
                        left = idx
                        crossDay = true
                    }

                    // 找最後一天
                    if (before && !cover) {
                        right = 6 - idx
                        crossDay = true
                    }

                    // 當天
                    if (between) {
                        left = idx
                        right = 6 - idx
                        crossDay = false
                    }

                    if (!before && !between && !future) return
                    if (idx > 0 && idx < 6 && cover) return

                    if (cover) crossDay = true

                    return {
                        ...date,
                        left,
                        right,
                        level: index,
                        index: i,
                        crossDay,
                    }

                }).filter(date => !!date)

                return newData

            }).filter(day => !!day.length)

            return newWeek

        }).flat(3)
            .sort((a, b) => b.index - a.index)
            .sort((a, b) => b.crossDay - a.crossDay)
            .reduce((acc, date, index, arr) => {
                if (date.crossDay === true &&
                    arr[index + 1] && arr[index + 1].level === date.level &&
                    arr[index + 1].sid === date.sid
                ) {
                    for (let i = date.left; i < 7 - arr[index + 1].right; i++) {
                        const key = `${date.level}_${i}`
                        subLevel[key] = subLevel[key] ? [...subLevel[key], date.sid] : [date.sid]
                    }
                    acc = [
                        ...acc,
                        {
                            ...date,
                            right: arr[index + 1].right,
                            sort: subLevel[`${date.level}_${date.left}`].indexOf(date.sid),
                        }
                    ]
                }

                if (!date.crossDay) {
                    for (let i = date.left; i < 7 - date.right; i++) {
                        const key = `${date.level}_${i}`
                        subLevel[key] = subLevel[key] ? [...subLevel[key], date.sid] : [date.sid]
                    }
                    acc = [...acc, {
                        ...date,
                        sort: subLevel[`${date.level}_${date.left}`].indexOf(date.sid),
                    }]
                }
                return acc
            }, [])

        return newDatas
    }

    const renderNotes = () => {

        const notes = formatCalendarData(newCalendarData)
        const cellBox = cellRef.current && cellRef.current.getBoundingClientRect()
        const noteHeight = 23
        if (!cellBox) return
        const minShowDetail = Math.floor(cellBox.height / noteHeight) - 3
        const totalLevels = weeks.length

        return notes.map(({ title, tag_color: hexColor, left, right, sort, level, ...data }, index) => {
            const isCannotShow = minShowDetail < 0 && sort === 1
            const tag_color = colorMap[hexColor]

            if (sort === minShowDetail || (isCannotShow)) return (
                <div
                    key={index}
                    draggable='true'
                    className='calendar-month-notes'
                    onClick={() => {
                        const newDate = new Date(data.btime)
                        newDate.setHours(0)
                        newDate.setMinutes(0)
                        setShowSchedule(true)
                        setNewShowData(newDate)
                        setSelectedDate({
                            sid: String(Date.now()),
                            title: "",
                            btime: newDate,
                            etime: addMinutes(60, newDate),
                            desc: "",
                            tag_color: "#BFDBFE",
                        })
                    }}
                >
                    <div
                        className={`calendar-month-notes-box absolute cursor-pointer opacity-70 `}
                        style={{
                            left: `${(100 / 7) * left}%`,
                            right: `${(100 / 7) * right}%`,
                            top: `calc(${20 * level}% + 34px + ${sort * noteHeight}px + ${sort ? sort : '0'}px)`
                        }}>
                        <div className='px-2 truncate flex justify-center items-center'>
                            <div className='notes-box-outer'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="calendar-icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )

            if (sort > minShowDetail) return null

            return (
                <div
                    key={index}
                    draggable='true'
                    onClick={() => handleSetDataAndShowDetail({ ...data, title, tag_color })}
                >
                    <div
                        className={`calendar-month-notes-box absolute cursor-pointer opacity-70 
                            ${tag_color ?
                                `bg-${tag_color}-hover text-${tag_color}-view` :
                                'bg-blue-hover text-blue-view'}`
                        }
                        style={{
                            left: `${(100 / 7) * left}%`,
                            right: `${(100 / 7) * right}%`,
                            top: `calc(${(100 / totalLevels) * level}% + 34px + ${sort * noteHeight}px + ${sort}px)`
                        }}>
                        <div className='notes-box-outer truncate'>{title}</div>
                    </div>
                </div>

            )
        })
    }

    useEffect(() => {
        if (calendarData) {
            const newData = calendarData && calendarData.data.filter((date) => filterDate({ ...props, ...date, dayCount: 30 })) || []
            setNewCalendarData(newData)
        }
    }, [calendarData, showData])

    useEffect(() => {
        if (showData) {
            setNewShowData(showData)
        }
    }, [showData])

    return (
        <>
            <div className="relative flex flex-1 w-full h-full">
                <div className="relative flex flex-1 w-full h-full">
                    {/* 大月曆(月) */}
                    <div className="inset-0 absolute flex flex-col">
                        {/* 週 */}
                        <div className='flex flex-1 select-none'>
                            {weeks.map((week, index) => (
                                <div key={index} className={`calendar-month-title relative flex flex-1 items-end ${!center ? 'calendar-month-title-center' : 'justify-center items-center h-full'}`}>
                                    {abbr ?
                                        <div className={`text-gray ${!textSm ? '' : 'calendar-text-sm'}`}>{week.abb_name}</div>
                                        :
                                        <>
                                            <div className="calendar-month-title-weekname-lg">{week.name}</div>
                                            <div className="calendar-month-title-weekname-md">{week.abb_name}</div>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                        {/* 日 */}
                        <div
                            className={`calendar-month-datebox relative flex-row overflow-visible`}
                        >
                            {renderDate(showData).map((week, index, datas) => (
                                week.map((data, i) => (
                                    <div
                                        key={i}
                                        className={`whitespace-nowrap absolute cursor-pointer ${classNames("bg-white", {
                                            "calendar-bg-today": 
                                            // !dateDiff({ btime: data.datetime, etime: newShowData })
                                             Number(data.date) === Number(fullDate.d) && Number(data.month) === Number(fullDate.m) && Number(data.year) === Number(fullDate.y)
                                        })}  ${!selector ? '' : 'calendar-selector'}
                                        ${!selector ?
                                                data.isToday ? 'calendar-today border-t'
                                                    : data.isOverdue ? 'calendar-overdue border-t' : 'bg-white border-t'
                                                : ''}`}
                                        style={{
                                            inset: `
                                            ${index * (100 / datas.length).toFixed(4)}% 
                                            ${(100 / 7 * (6 - i)).toFixed(4)}% 
                                            ${100 - (100 / datas.length) * (index + 1)}% 
                                            ${(100 / 7 * (i)).toFixed(4)}%`
                                        }}
                                        onClick={() => handleSetDate(data)}
                                    >{console.log('data', data)}
                                        <div
                                            className={`calendar-month-date flex flex-col w-full h-full overflow-hidden ${selector && data.isToday ? 'calendar-month-date-selector' : ''} `}
                                            ref={elm => cellRef.current = elm}
                                        >
                                            <div className={`w-full select-none ${!center ? '' : 'flex justify-center items-center h-full'}`}>
                                                {data.formatDate ?
                                                    abbr ?
                                                        <div 
                                                            className={`${!textSm ? '' : 'calendar-text-sm'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.date}</div>
                                                        :
                                                        <>
                                                            <div 
                                                                className={`calendar-month-date-name ${!textSm ? '' : 'calendar-text-sm'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.formatDate}</div>
                                                            <div 
                                                                className={`calendar-month-date-date ${!textSm ? '' : 'calendar-text-sm'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.date}</div>
                                                        </>

                                                    :
                                                    <span className={`${!textSm ? '' : 'calendar-text-sm'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.date}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ))}
                            {renderNotes()}
                        </div>
                    </div>
                </div>

                {showSchedule && canEdit && <Schedule
                    calendarData={newCalendarData}
                    showData={newShowData}
                    handleClose={() => setShowSchedule(false)}
                    showEditor={showEditor}
                    setShowEditor={setShowEditor}
                    setSelectedDate={setSelectedDate}
                />}
            </div>

            <Modal
                Content={SchedualDetail}
                show={showDetail}
                handleClose={() => setShowDetail(false)}
                defaultValue={selectedDate}
                setDefaultValue={setSelectedDate}
                calendarData={newCalendarData}
                setCalendarData={setNewCalendarData}
            />

            <Modal
                Content={EditorNote}
                show={showEditor}
                handleClose={() => setShowEditor(false)}
                defaultValue={selectedDate}
                setDefaultValue={setSelectedDate}
                calendarData={newCalendarData}
                setCalendarData={setNewCalendarData}
            />

        </>
    );
};

export default CalendarM;