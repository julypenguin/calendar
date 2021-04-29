import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import '../styl/styles.css'
import { getFullDate, filterDate, addMinutes } from 'lib/datetime'
import { weeks } from './formateDate'
import EditorNote from './EditorNote'
import Schedule from './Schedule'

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
    const [showEditor, setShowEditor] = useState(false)
    const [showSchedule, setShowSchedule] = useState(false)

    const cellRef = useRef()

    const fullDate = getFullDate(newShowData)

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
                    tag_color: "blue",
                })
            }

        }
    }

    const handleSetDataAndShowEditor = (data) => {
        setSelectedDate(data)
        setShowEditor(true)
    }

    const formatCalendarData = (data) => {
        const weeks = renderDate(showData)
        let subLevel = {} // 紀錄某一天有幾筆資料

        // 先把一天一天跑起來，再來看特定日子有哪幾個資料
        const newDatas = weeks.map((week, index, arr) => {
            const newWeek = week.map((day, idx) => {
                const newData = data.map((date) => {
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
                        crossDay,
                    }

                }).filter(date => !!date)

                return newData

            }).filter(day => !!day[0])

            return newWeek

        }).flat(3)
            .sort((a, b) => {
                return ((b.crossDay - a.crossDay) * Date.now()) + (Number(b.sid) - Number(a.sid))
            })
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

        return notes.map(({ title, tag_color, left, right, sort, level, ...data }, index) => {
            const isCannotShow = minShowDetail < 0 && sort === 1

            if (sort === minShowDetail || (isCannotShow)) return (
                <div
                    key={index}
                    draggable='true'
                    className='hidden lg:block'
                // onClick={() => handleSetDataAndShowEditor({ ...data, title, tag_color })}
                >
                    <div className={`absolute cursor-pointer box-border mr-2 rounded opacity-70 `} style={{ left: `${(100 / 7) * left}%`, right: `${(100 / 7) * right}%`, top: `calc(${20 * level}% + 34px + ${sort * noteHeight}px + ${sort ? sort : '0'}px)`, height: '23px' }}>
                        <div className='px-2 truncate flex justify-center items-center'>
                            <div className='px-1 hover:bg-gray-300'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    onClick={() => handleSetDataAndShowEditor({ ...data, title, tag_color })}
                >
                    <div className={`absolute cursor-pointer box-border mr-2 rounded opacity-70 ${tag_color ? `bg-${tag_color}-200 text-${tag_color}-800 hover:bg-${tag_color}-300` : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}`} style={{ left: `${(100 / 7) * left}%`, right: `${(100 / 7) * right}%`, top: `calc(${20 * level}% + 34px + ${sort * noteHeight}px + ${sort ? sort : '0'}px)`, height: '23px' }}>
                        <div className='px-2 truncate'>{title}</div>
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
                                <div key={index} className={`relative flex flex-1 text-xs items-end mb-4 ${!center ? 'px-4 h-8' : 'justify-center items-center h-full'}`}>
                                    {abbr ?
                                        <div className={`text-gray-500 ${!textSm ? '' : 'text-xs'}`}>{week.abb_name}</div>
                                        :
                                        <>
                                            <div className="text-gray-500 hidden md:block">{week.name}</div>
                                            <div className="text-gray-500 md:hidden">{week.abb_name}</div>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                        {/* 日 */}
                        <div
                            className={`relative height-full flex-row overflow-visible bg-gray-100`}
                            style={{ flex: '1 1 100%' }}
                        >
                            {renderDate(showData).map((week, index, datas) => (
                                week.map((data, i) => (
                                    <div
                                        key={i}
                                        className={`whitespace-nowrap text-sm font-medium text-gray-900 absolute cursor-pointer ${Number(data.date) === Number(fullDate.d) && Number(data.month) === Number(fullDate.m) && Number(data.year) === Number(fullDate.y) ? 'bg-blue-100 opacity-70' : 'bg-white'} ${!selector ? '' : 'hover:bg-gray-100'}
                                        ${!selector ?
                                                data.isToday ? 'calendar-today border-t'
                                                    : data.isOverdue ? 'bg-gray-100 border-t' : 'bg-white border-t'
                                                : ''}`}
                                        style={{
                                            inset: `
                                            ${index * (100 / datas.length).toFixed(4)}% 
                                            ${(100 / 7 * (6 - i)).toFixed(4)}% 
                                            ${100 - (100 / datas.length) * (index + 1)}% 
                                            ${(100 / 7 * (i)).toFixed(4)}%`
                                        }}
                                        onClick={() => handleSetDate(data)}
                                    >
                                        <div
                                            className={`py-2 flex flex-col w-full h-full overflow-hidden ${selector && data.isToday ? 'rounded-full bg-blue-600' : ''} `}
                                            ref={cellRef}
                                        >
                                            <div className={`px-4 top w-full select-none ${!center ? '' : 'flex justify-center items-center h-full'}`}>
                                                {data.formateDate ?
                                                    abbr ?
                                                        <div className={`${!textSm ? '' : 'text-xs'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.date}</div>
                                                        :
                                                        <>
                                                            <div className={`hidden md:block ${!textSm ? '' : 'text-xs'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.formateDate}</div>
                                                            <div className={`md:hidden ${!textSm ? '' : 'text-xs'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.date}</div>
                                                        </>

                                                    :
                                                    <span className={`${!textSm ? '' : 'text-xs'} ${selector && data.isToday ? 'text-white' : selector && !data.main ? 'text-gray-300' : 'text-gray-500'}`}>{data.date}</span>
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

                {!showSchedule ? null : <Schedule
                    calendarData={newCalendarData}
                    showData={newShowData}
                    handleClose={() => setShowSchedule(false)}
                    showEditor={showEditor}
                    setShowEditor={setShowEditor}
                    setSelectedDate={setSelectedDate}
                />}
            </div>

            <EditorNote
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