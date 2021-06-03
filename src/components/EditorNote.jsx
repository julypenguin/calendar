import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { createPortal } from 'react-dom'
import { getFullDate, parseToDateString, parseToISOString, addDays } from 'lib/datetime'
import { Datetimepicker } from '@iqs/datetimepicker'
import '@iqs/datetimepicker/index.styl'
import { colorMap, weeks, modeMap } from './formatDate'
import { Fragment } from 'react';
import Dropdown from './Dropdown'

const EditorNote = ({
    calendarData, // 整個行程陣列資料
    setCalendarData, // 將資料傳出去
    detailDate,
    setDetailDate,
    handleClose,
    getAvatar, // 取得 avatar 圖片，必須是 function
    customEditor, // 可以塞入客製化編輯器，用於編輯備註
    renderDate,
    evt_sid, // 活動編號，有這個編號才能透過 api 修改活動，否則只能新增
}) => {
    const [repeatDateNumbers, setRepeatDateNumbers] = useState({})
    const [showCategory, setShowCategory] = useState(false)
    const [showCycleNumberList, setShowCycleNumberList] = useState(false)
    const [showCycleList, setShowCycleList] = useState(false)
    const [showRepeatWeek, setShowRepeatWeek] = useState(false)
    // const [showRepeatDate, setShowRepeatDate] = useState(false)
    const tag_color = colorMap[detailDate.tag_color] || 'blue'
    const fullDay = getFullDate(detailDate.start_time)
    const renderWeeks = renderDate(detailDate.start_time)

    const categoryRef = useRef()
    const cycleNumberRef = useRef()
    const cycleListRef = useRef()
    const categoryList = [
        {
            name: 'red',
            hexColor: '#FECACA',
        },
        {
            name: 'pink',
            hexColor: '#FBCFE8',
        },
        {
            name: 'yellow',
            hexColor: '#FDE68A',
        },
        {
            name: 'green',
            hexColor: '#A7F3D0',
        },
        {
            name: 'blue',
            hexColor: '#BFDBFE',
        },
        {
            name: 'indigo',
            hexColor: '#C7D2FE',
        },
        {
            name: 'purple',
            hexColor: '#DDD6FE',
        },
        {
            name: 'gray',
            hexColor: '#E5E7EB',
        },
        {
            name: 'bewitched-tree',
            hexColor: '#76C4AE',
        },
        {
            name: 'mystical-green',
            hexColor: '#9FC2BA',
        },
        {
            name: 'light-heart',
            hexColor: '#BEE9E4',
        },
        {
            name: 'glass-gall',
            hexColor: '#7CE0F9',
        },
        {
            name: 'silly-fizz',
            hexColor: '#CAECCF',
        },
        {
            name: 'brain-sand',
            hexColor: '#D3D2B5',
        },
        {
            name: 'mustard-addicted',
            hexColor: '#CABD80',
        },
        {
            name: 'magic-powder',
            hexColor: '#E1CEB1',
        },
        {
            name: 'true-blush',
            hexColor: '#DDB0A0',
        },
        {
            name: 'merry-cranesbill',
            hexColor: '#D86C70',
        },
    ]

    const onAbandon = () => {
        handleClose()
    }

    const fetchPostCalendar = (data) => {
        console.log('data', data)
        const options = {
            headers: {
                'Accept': '*',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
        }

        fetch('https://support6-dev.iqs-t.com/teamweb/api/teamweb/calendar', {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log('post_result', res)
        })
    }

    const fetchPatchCalendar = (data) => {
        console.log('data', data)
        const options = {
            headers: {
                'Accept': '*',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
        }

        fetch(`https://support6-dev.iqs-t.com/teamweb/api/teamweb/calendar/${data.evt_sid}`, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data)
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log('post_result', res)
        })
    }

    const onSave = () => {
        if ((new Date(detailDate.end_time) - new Date(detailDate.start_time)) < 0) {
            detailDate.end_time = detailDate.start_time
        }

        const addLength = calendarData.filter((data, index) => data.sid === detailDate.sid).length
        const newCalendarData = calendarData.map((data, index) => {
            if (data.sid === detailDate.sid) return detailDate
            return data
        })
        if (!addLength) newCalendarData.push(detailDate)
        setCalendarData(newCalendarData)
        handleClose()
        if (evt_sid) {
            fetchPatchCalendar({
                ...detailDate,
                color: detailDate.tag_color,
                detail: detailDate.desc,
            })
        } else {
            fetchPostCalendar({
                ...detailDate,
                color: detailDate.tag_color,
                // "start_time":"2021-05-20T12:34:56",
                // "end_time":"2021-05-30T12:34:56",
                // "title":"This is a Repeat event created by unit test",
                detail: detailDate.desc,
                // "location":"VS2019",
                // "is_allday":false,
                // "is_repeat":true,
                // "attends":[535,1028,1247],
                // "mode":0,
                // "freq":1,
                // "freq_month":0,
                // "calc_type":0,
                // "calc_num":0,
                // "week_bit":0,
                // "final_date":"2021-05-30T12:34:56"
            })
        }
    }

    const deleteAttend = aa_sid => {
        const newAttend = (detailDate.attend && detailDate.attend.filter(member => member.aa_sid !== aa_sid)) || []

        setDetailDate({
            ...detailDate,
            attend: newAttend
        })
    }

    // 設定要重複的日期(單選)
    // const handleSetReapeatDate = (num) => {
    //     if (repeatDateNumbers[num] && Object.keys(repeatDateNumbers).length === 1) return

    //     setRepeatDateNumbers({
    //         // ...repeatDateNumbers,
    //         [num]: !repeatDateNumbers[num],
    //     })
    // }

    // 設定要重複的星期幾(複選)
    const handleSetRepeatWeek = week_bit => {
        let weekBit = 1
        if ((week_bit & detailDate.week_bit) === week_bit) {
            if (detailDate.week_bit - week_bit === 0) return
            weekBit = detailDate.week_bit - week_bit
        } else {
            weekBit = detailDate.week_bit + week_bit
        }

        setDetailDate({
            ...detailDate,
            week_bit: weekBit,
        })
    }

    const detectPosition = (ref, rightAndBottom) => {
        if (!ref) return {}
        const elementRef = ref.current
        const ele = elementRef.getBoundingClientRect()

        if (rightAndBottom && parentEle) {
            return { top: ele.bottom, right: parentEle.right - ele.right, zIndex: 6666666 }
        }
        if (window.innerHeight - ele.top > 310) return { top: ele.bottom + 2, left: ele.left, zIndex: 6666666 }
        else return { top: ele.top + ele.height, right: ele.left, zIndex: 6666666, width: '219px', height: '215.7px' }
    }

    const renderCategoryList = (data, index) => {
        if (!data) return null
        const color = colorMap[data.hexColor]
        return (
            <li
                key={index}
                className={`flex flex-nowrap items-center pl-2 py-2 pr-8 bg-gray-100-g-hover cursor-pointer`}
                onClick={() => setDetailDate({ ...detailDate, tag_color: data.hexColor.toLocaleUpperCase() })}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-${color}-fresh`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>
                    <FormattedMessage id={`calendar.category.${data.name}`} />
                </span>
            </li>
        )
    }

    const renderMonths = () => {
        const monthList = new Array(12).fill('')
        return monthList.map((data, index) => (
            <li
                key={index}
                className='flex justify-center items-center mr-3 rounded-full bg-gray-200 hover:bg-gray-300'
                style={{ height: '38px', width: '38px' }}
            >
                <div className='text-sm'>
                    <FormattedDate
                        value={`${index + 1}-01`
                        }
                        month="numeric"
                    />
                </div>
            </li>
        ))
    }

    const numOfWeeks = () => {
        const startTime = new Date(detailDate.start_time)
        startTime.setHours(0)
        startTime.setMinutes(0)
        startTime.setSeconds(0)

        return renderWeeks.reduce((acc, week) => {
            return acc + week.filter(date => date.datetime - startTime === 0)
                .reduce((acc, date) => 0 + date.level, 0)
    
        }, 0)
    }

    const renderOnWeek = (mode) => {
        const startTime = new Date(detailDate.start_time)

        const dayOfTheWeek = startTime.getDay()
        const month = fullDay.m

        if (mode === 3) {
            return (
                <>
                    <FormattedMessage
                        id='calendar.on_week'
                        values={{ number: numOfWeeks() }}
                    />
                    {weeks.map((week, index) => (
                        dayOfTheWeek !== index ? null :
                            <Fragment key={index}>
                                <span className='text-sm'>{week.name}</span>
                            </Fragment>
                    ))}
                </>
            )
        }

        if (mode === 4) {
            return (
                <>
                    <FormattedMessage
                        id='calendar.on_week_of_month'
                        values={{ number: numOfWeeks(), month }}
                    />
                    {weeks.map((week, index) => (
                        dayOfTheWeek !== index ? null :
                            <Fragment key={index}>
                                <span className='text-sm'>{week.name}</span>
                            </Fragment>
                    ))}
                </>
            )
        }
    }

    const renderOnDate = (mode) => {
        const date = fullDay.d
        const month = fullDay.m

        if (mode === 3) {
            return (
                <FormattedMessage
                    id='calendar.on_date'
                    values={{ date }}
                />
            )
        }

        if (mode === 4) {
            return (
                <FormattedMessage
                    id='calendar.on_month_and_date'
                    values={{ month, date }}
                />
            )
        }
    }

    // const renderDates = () => {
    //     if (!detailDate.btime) return
    //     if (!new Date(detailDate.btime).getDate()) return
    //     const fullDate = getFullDate(detailDate.btime)
    //     const y = Number(fullDate.y)
    //     const m = Number(fullDate.m)
    //     const d = Number(fullDate.d)
    //     const days = (new Date(y, m, 1) - new Date(y, m - 1, 1)) / (86400 * 1000)
    //     const dateList = new Array(days).fill('')

    //     return dateList.map((date, index) => {
    //         const day = index + 1
    //         return (
    //             <li
    //                 key={index}
    //                 className={`flex justify-center items-center mb-4 mr-3 rounded-full ${repeatDateNumbers[day] ? 'bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'}`}
    //                 style={{ height: '38px', width: '38px' }}
    //                 onClick={() => handleSetReapeatDate(day)}
    //             >
    //                 <div className='text-sm'>
    //                     <FormattedDate
    //                         value={`${m > 9 ? m : '0' + m}-${index + 1 > 9 ? index + 1 : '0' + (index + 1)}`
    //                         }
    //                         day="numeric"
    //                     />
    //                 </div>
    //             </li>
    //         )
    //     })
    // }

    const renderCycleNumberList = () => {
        return new Array(99).fill('').map((d, index) => (
            <li
                key={index}
                className='flex justify-center items-center p-2 bg-gray-100-g-hover cursor-pointer'
                onClick={() => {
                    // setCycleNumber(index + 1)
                    setDetailDate({
                        ...detailDate,
                        freq: index + 1,
                    })
                    setShowCycleNumberList(false)
                }}
            >
                {index + 1}
            </li>
        ))
    }

    const renderCycleList = () => {
        const cycleList = [
            { mode: 0, name: 'never' },
            { mode: 1, name: 'day' },
            { mode: 2, name: 'week' },
            { mode: 3, name: 'month' },
            { mode: 4, name: 'year' }
        ]

        return cycleList.map((cycle, index) => (
            <li
                key={index}
                className='flex items-center p-2 bg-gray-100-g-hover cursor-pointer'
                onClick={() => {
                    // setCycleName(cycle)
                    // setDetailDate({ ...detailDate, mode: cycle.mode, xxx: 1 })
                    setShowCycleList(false)
                    if (cycle.name === 'never') {
                        setDetailDate({ ...detailDate, is_repeat: false, mode: cycle.mode })
                        // setDetailDate({ ...detailDate, final_date: parseToISOString(addDays(30)), is_repeat: false })
                    } else {
                        setDetailDate({ ...detailDate, is_repeat: true, mode: cycle.mode })
                        // setDetailDate({ ...detailDate, final_date: parseToISOString(addDays(30)), is_repeat: true })
                    }
                }}
            >
                <FormattedMessage id={`calendar.${cycle.name}`} />
            </li>
        ))
    }

    // useEffect(() => {
    //     if (detailDate.btime) {
    //         const d = fullDay.d
    //         setRepeatDateNumbers({
    //             [d]: true,
    //         })
    //     }
    // }, [detailDate])

    return (
        <>
            {/* 頁首 */}
            <div className={`bg-${tag_color}-500-g pl-2 pr-1 flex justify-end`}>
                <div
                    className='p-2 text-white cursor-pointer'
                    onClick={handleClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            {/* 功能按鈕 */}
            <div className={`bg-${tag_color}-50-g pl-8 pr-1 py-1 flex select-none`}>
                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color} bg-${tag_color}-100-g-hover`}
                    onClick={onSave}
                >
                    <Icon className='mr-2' icon={['far', 'save']} />
                    <span><FormattedMessage id='calendar.save' /></span>
                </div>

                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color} bg-${tag_color}-100-g-hover flex flex-nowrap`}
                    onClick={onAbandon}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span><FormattedMessage id='calendar.abandon' /></span>
                </div>

                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color} bg-${tag_color}-100-g-hover flex flex-nowrap`}
                    onClick={() => setShowCategory(!showCategory)}
                    ref={categoryRef}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className='px-2'>
                        <FormattedMessage id={`calendar.category.${tag_color}`} />
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>

                    {!showCategory ? null : createPortal(
                        <div className={`fixed h-full w-full top-0 z-10`}>
                            <div
                                className='fixed h-full w-full top-0 left-0'
                                onClick={() => setShowCategory(false)}
                            ></div>
                            <div
                                className={`absolute bg-white rounded-md ring-1-op10-black transition-g ease-out-g duration-75-g flex`}
                                style={detectPosition(categoryRef)}
                            >
                                <div className='flex flex-col select-none'>
                                    <ul className='flex flex-col'>
                                        {categoryList.map((data, index) => renderCategoryList(data, index))}
                                    </ul>
                                </div>
                                <div className='top-0 border-r'></div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>

            {/* 內容 */}
            <div className='flex min-h-0 flex-auto flex-col'>
                <div className='p-2 pr-4 pt-8'>
                    {/* 新增標題 */}
                    <div
                        className='mb-4 flex'
                        style={{ minHeight: '32px' }}
                    >
                        <div
                            className='mr-2'
                            style={{ width: '32px', height: '32px' }}
                        >

                        </div>
                        <div className='flex-grow flex'>
                            <input
                                className={`text-${tag_color} mr-2 pb-1 pl-4 flex-grow text-2xl font-semibold border-0 border-b border-solid border-gray-300-g border-gray-600-g-hover outline-none-focus`}
                                placeholder='新增標題'
                                value={detailDate.title}
                                onChange={e => setDetailDate({ ...detailDate, title: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* 選擇時間 */}
                    <div className='flex mb-4'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400-g" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-1'>
                                {detailDate.all_day ?
                                    <div className='flex-1'>
                                        <div className='datetimepicker-box flex mb-4'>
                                            <Datetimepicker
                                                name="start_time"
                                                value={parseToISOString(detailDate.start_time)}
                                                onChange={value => setDetailDate({ ...detailDate, start_time: value })}
                                                notime
                                            />
                                        </div>

                                        <div className='datetimepicker-box flex' onBlur={() => setDetailDate({ ...detailDate, end_time: detailDate.start_time })}>
                                            <Datetimepicker
                                                name="end_time"
                                                value={parseToISOString(detailDate.end_time)}
                                                min={parseToISOString(detailDate.start_time)}
                                                onChange={value => setDetailDate({ ...detailDate, end_time: value })}
                                                notime
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div className='flex-1'>
                                        <div className='datetimepicker-box flex mb-4'>
                                            <Datetimepicker
                                                name="start_time"
                                                value={parseToISOString(detailDate.start_time)}
                                                onChange={value => setDetailDate({ ...detailDate, start_time: value })}
                                            />
                                        </div>

                                        <div className='datetimepicker-box flex' onBlur={() => setDetailDate({ ...detailDate, end_time: detailDate.start_time })}>
                                            <Datetimepicker
                                                name="end_time"
                                                value={parseToISOString(detailDate.end_time)}
                                                min={parseToISOString(detailDate.start_time)}
                                                onChange={value => setDetailDate({ ...detailDate, end_time: value })}
                                            />
                                        </div>
                                    </div>
                                }

                                <div className='p-1'>
                                    <div className='flex flex-nowrap p-1'>
                                        <span className='flex flex-shrink-0 mr-2'>
                                            <FormattedMessage id='calendar.all_day' />
                                        </span>
                                        <button
                                            type="button"
                                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors-g ease-in-out-g duration-200-g outline-none-focus ring-2-focus ${detailDate.all_day ? 'bg-blue-500-g' : 'bg-gray'}`}
                                            role="switch"
                                            aria-checked="false"
                                            onClick={() => setDetailDate({ ...detailDate, all_day: !detailDate.all_day })}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-g transform-g ring-0 transition-g ease-in-out-g duration-200-g ${detailDate.all_day ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* 出席者 */}
                    <div className='flex mb-4'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400-g" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-wrap flex-1 mr-2 relative border-0 border-b border-solid border-gray-300-g border-gray-600-g-hover'>
                                {detailDate.attend && detailDate.attend.map(aa => (
                                    <div
                                        key={aa.aa_sid}
                                        className='flex ml-4 mb-2 rounded-full cursor-pointer bg-blue-50-g bg-blue-100-g-hover'>
                                        <div
                                            className='relative'
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            <div className='absolute inset-0 rounded-full bg-white'>
                                                {typeof getAvatar !== 'function' ? null :
                                                    <img
                                                        className='w-full h-full rounded-full border border-gray-300-g border-solid'
                                                        src={getAvatar(aa.aa_sid)}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className={`pl-2 mr-2 text-${tag_color}`}>{aa.aa_name || aa.aa_id}</div>
                                            <div
                                                className='relative rounded-full bg-blue-200-hover'
                                                style={{ width: '32px', height: '32px' }}
                                            >
                                                <div
                                                    className='absolute inset-0 flex justify-center items-center'
                                                    onClick={() => deleteAttend(aa.aa_sid)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${tag_color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 地點 */}
                    <div className='flex mb-4'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400-g" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-wrap flex-1 mr-2 relative border-0 border-b border-solid border-gray-300-g border-gray-600-g-hover'>
                                <input
                                    type='text'
                                    className='pl-4 flex-1 outline-none border-0 outline-none-focus'
                                    value={detailDate.location}
                                    onChange={e => setDetailDate({
                                        ...detailDate,
                                        location: e.target.value,
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 重複 */}
                    <div className='flex mb-4 flex-wrap select-none'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400-g" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-wrap flex-1 mr-2 pb-1 pl-4 border-0 border-b border-solid border-gray-300-g border-gray-600-g-hover'>
                                <div className='flex'>
                                    <div className='mr-2'>
                                        <span className='mr-1'>
                                            <FormattedMessage id='calendar.repeat' />
                                            {detailDate.mode === 0 ? null : <FormattedMessage id='calendar.interval' />}
                                        </span>
                                        <span>:</span>
                                    </div>

                                    {/* 顯示重複間隔天數 */}
                                    {detailDate.mode === 0 || detailDate.mode === 4 ? null : <div
                                        className='calendar-inner-icon-hover mr-2 flex flex-shrink-0 cursor-pointer'
                                        ref={cycleNumberRef}
                                        onClick={() => setShowCycleNumberList(!showCycleNumberList)}
                                    >
                                        <span className='px-2'>{detailDate.freq}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300-g" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>}

                                    {/* 重複間隔天數選擇 */}
                                    {!showCycleNumberList ? null : <Dropdown
                                        parentRef={cycleNumberRef}
                                        handleClose={() => setShowCycleNumberList(false)}
                                        style={{ height: '296px' }}
                                    >
                                        {renderCycleNumberList()}
                                    </Dropdown>}

                                    {/* 顯示重複哪個週期 */}
                                    <div
                                        className='calendar-inner-icon-hover mr-2 flex flex-shrink-0 cursor-pointer'
                                        ref={cycleListRef}
                                        onClick={() => setShowCycleList(!showCycleList)}
                                    >
                                        <span className='px-2'>
                                            {typeof detailDate.mode === 'number' && <FormattedMessage id={`calendar.${modeMap[detailDate.mode]}`} />}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300-g" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {/* 重複週期選擇 */}
                                    {!showCycleList ? null : <Dropdown
                                        parentRef={cycleListRef}
                                        handleClose={() => setShowCycleList(false)}
                                    >
                                        {renderCycleList()}
                                    </Dropdown>}


                                </div>

                                {/* 選擇特定日期 */}
                                {detailDate.mode !== 3 && detailDate.mode !== 4 ? null : <fieldset className='w-full mt-2'>
                                    <div className="bg-white rounded-md">
                                        {/* 於...日 */}
                                        <label className="relative py-2 flex cursor-pointer">
                                            <input
                                                type="radio"
                                                name="calc_type"
                                                className="mt-0.5 cursor-pointer text-indigo-600-g border-gray-300-g "
                                                checked={detailDate.calc_type === 0}
                                                onChange={e => setDetailDate({
                                                    ...detailDate,
                                                    calc_type: 0,
                                                    freq_month: fullDay.m,
                                                    calc_num: fullDay.d,
                                                })}
                                            />
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-gray-900-g font-medium flex">
                                                    <span className='mr-2 text-sm'>{renderOnDate(detailDate.mode)}</span>
                                                    {/* 自訂日期 */}
                                                    {/* <span
                                                        className='flex justify-center items-center text-gray-400 text-sm hover:text-gray-500'
                                                        onClick={() => setShowRepeatDate(!showRepeatDate)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </span> */}
                                                </span>

                                                {/* 選擇日期 */}
                                                {/* {showRepeatDate && <div className='w-full mt-2'>
                                                    <ul className='flex flex-wrap py-2'>
                                                        {renderDates()}
                                                    </ul>
                                                </div>} */}
                                            </div>
                                        </label>

                                        {/* 於第幾個星期幾 */}
                                        <label className="relative py-2 flex cursor-pointer">
                                            <input
                                                type="radio"
                                                name="calc_type"
                                                className="mt-0.5 cursor-pointer text-indigo-600-g border-gray-300-g"
                                                checked={detailDate.calc_type === 1}
                                                onChange={e => setDetailDate({
                                                    ...detailDate,
                                                    calc_type: 1,
                                                    freq_month: fullDay.m,
                                                    calc_num: numOfWeeks(),
                                                    week_bit: weeks[new Date(detailDate.start_time).getDay()].week_bit
                                                })} />
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-gray-900-g text-sm font-medium flex flex-wrap mr-2">
                                                    <span className='mr-2 text-sm'>{renderOnWeek(detailDate.mode)}</span>
                                                    {/* 自訂星期幾 */}
                                                    {/* <span
                                                        className='flex justify-center items-center text-gray-400 text-sm hover:text-gray-500'
                                                        onClick={() => setShowRepeatWeek(!showRepeatWeek)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </span> */}

                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </fieldset>}

                                {/* 選擇星期幾 */}
                                {(showRepeatWeek || detailDate.mode === 2) && <div className='w-full mt-2'>
                                    <ul className='flex py-2'>
                                        {weeks.map((day, index) => (
                                            <li
                                                key={index}
                                                className={`flex justify-center items-center mr-3 rounded-full ${(day.week_bit & detailDate.week_bit) === day.week_bit ? 'bg-blue' : 'bg-gray bg-gray-300-hover'}`}
                                                style={{ height: '38px', width: '38px' }}
                                                onClick={() => handleSetRepeatWeek(day.week_bit)}
                                            >
                                                <div className='text-sm'>{day.abb_name}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>}

                                {/* 重複至 */}
                                {detailDate.mode !== 0 && <div className='flex w-full mt-2'>
                                    {detailDate.is_repeat && <div className='flex items-center'>
                                        <span className=''>
                                            <FormattedMessage id='calendar.repeat_until' />
                                        </span>
                                    </div>}

                                    {/* 顯示重複的結束日期 */}
                                    {detailDate.is_repeat && <div
                                        className='calendar-inner-icon-hover flex flex-shrink-0 cursor-pointer'
                                    >
                                        <div className='datetimepicker-box-no-borderb flex'>
                                            <Datetimepicker
                                                name="final_date"
                                                value={!detailDate.final_date || detailDate.final_date === '0001-01-01T00:00:00' ? parseToISOString(addDays(30)) : parseToISOString(detailDate.final_date)}
                                                onChange={value => setDetailDate({ ...detailDate, final_date: value })}
                                                notime
                                            />
                                        </div>
                                    </div>}

                                    {detailDate.is_repeat ?
                                        <div
                                            className='flex items-center text-sm text-blue-500-g cursor-pointer'
                                            onClick={() => {
                                                setDetailDate({ ...detailDate, final_date: '0001-01-01T00:00:00', is_repeat: false })
                                            }}
                                        >
                                            <FormattedMessage id='calendar.remove_end_date' />
                                        </div>
                                        :
                                        <div
                                            className='flex items-center text-sm text-blue-500-g cursor-pointer'
                                            onClick={() => {
                                                setDetailDate({ ...detailDate, final_date: parseToISOString(addDays(30)), is_repeat: true })
                                            }}
                                        >
                                            <FormattedMessage id='calendar.add_end_date' />
                                        </div>}
                                </div>}

                                {/* 選擇月份 */}
                                {/* <div className='w-full mt-2'>
                                    <ul className='flex py-2'>
                                        {renderMonths()}
                                    </ul>
                                </div> */}

                                {/* 選擇日期 */}
                                {/* <div className='w-full mt-2'>
                                    <ul className='flex flex-wrap py-2'>
                                        {renderDates()}
                                    </ul>
                                </div> */}

                                {/* 選擇星期幾 */}
                                {/* <div className='w-full mt-2'>
                                    <ul className='flex py-2'>
                                        {weeks.map((day, index) => (
                                            <li
                                                key={index}
                                                className='flex justify-center items-center mr-3 rounded-full bg-gray-200 hover:bg-gray-300'
                                                style={{ height: '38px', width: '38px' }}
                                            >
                                                <div className='text-sm'>{day.abb_name}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* 備註 */}
                    <div className='flex mb-4'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400-g" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </div>

                            {customEditor ?
                                <input
                                    className='border border-gray-300-g w-full h-32'
                                    style={{ padding: '8px' }}
                                    value={detailDate.desc}
                                    onChange={e => setDetailDate({
                                        ...detailDate,
                                        desc: e.target.value,
                                    })}
                                />
                                :
                                <textarea
                                    className='border border-gray-300-g w-full h-32'
                                    style={{ padding: '8px' }}
                                    value={detailDate.desc}
                                    onChange={e => setDetailDate({
                                        ...detailDate,
                                        desc: e.target.value,
                                    })}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className='p-2 pr-4'></div>
            </div>
        </>
    );
};

export default EditorNote;