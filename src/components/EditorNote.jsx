import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { createPortal } from 'react-dom'
import { getFullDate, parseToDateString, parseToISOString, addDays } from 'lib/datetime'
import { Datetimepicker } from '@iqs/datetimepicker'
import '@iqs/datetimepicker/index.styl'
import { colorMap, weeks } from './formatDate'
import { Fragment } from 'react';
import Dropdown from './Dropdown'

const EditorNote = ({
    calendarData, // 整個行程陣列資料
    setCalendarData, // 將資料傳出去
    detailDate,
    setDetailDate,
    handleClose,
}) => {

    const [repeatWeekNumbers, setRepeatWeekNumbers] = useState({})
    const [repeatDateNumbers, setRepeatDateNumbers] = useState({})
    const [cycleNumber, setCycleNumber] = useState(1)
    const [cycleName, setCycleName] = useState('never')
    const [showCategory, setShowCategory] = useState(false)
    const [showCycleNumberList, setShowCycleNumberList] = useState(false)
    const [showCycleList, setShowCycleList] = useState(false)
    const [showRepeatWeek, setShowRepeatWeek] = useState(false)
    // const [showRepeatDate, setShowRepeatDate] = useState(false)
    const tag_color = colorMap[detailDate.tag_color] || 'blue'

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

    const onSave = () => {
        if ((new Date(detailDate.etime) - new Date(detailDate.btime)) < 0) {
            detailDate.etime = detailDate.btime
        }

        const addLength = calendarData.filter((data, index) => data.sid === detailDate.sid).length
        const newCalendarData = calendarData.map((data, index) => {
            if (data.sid === detailDate.sid) return detailDate
            return data
        })
        if (!addLength) newCalendarData.push(detailDate)
        setCalendarData(newCalendarData)
        handleClose()
    }

    // 設定要重複的日期(單選)
    const handleSetReapeatDate = (num) => {
        if (repeatDateNumbers[num] && Object.keys(repeatDateNumbers).length === 1) return

        setRepeatDateNumbers({
            // ...repeatDateNumbers,
            [num]: !repeatDateNumbers[num],
        })
    }

    // 設定要重複的星期幾(複選)
    const handleSetRepeatWeek = (name, day) => {
        const newRepeatWeekNumbers = {
            ...repeatWeekNumbers
        }

        if (repeatWeekNumbers[day]) {
            if (Object.keys(newRepeatWeekNumbers).length === 1) return
            delete newRepeatWeekNumbers[day]
            setRepeatWeekNumbers(newRepeatWeekNumbers)
        } else {
            setRepeatWeekNumbers({
                ...repeatWeekNumbers,
                [day]: name,
            })
        }
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
                className={`flex flex-nowrap items-center pl-2 py-2 pr-8 bg-gray-light-hover cursor-pointer`}
                onClick={() => setDetailDate({ ...detailDate, tag_color: data.hexColor.toLowerCase() })}
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

    const renderOnWeek = () => {
        let weekList = []
        for (const key in repeatWeekNumbers) {
            weekList.push(repeatWeekNumbers[key])
        }

        return (
            <>
                <FormattedMessage
                    id='calendar.on_week'
                    values={{ number: '3' }}
                />
                {weekList.map((week, index) => (
                    <Fragment key={index}>
                        {!index ? null : <span className='mr-2 text-sm'>,</span>}
                        <span className='text-sm'>{week}</span>
                    </Fragment>
                ))}
            </>
        )
    }

    const renderOnDate = () => {
        let dayString = ''
        for (const key in repeatDateNumbers) {
            if (Object.hasOwnProperty.call(repeatDateNumbers, key)) {
                if (!dayString) dayString = key
                else dayString = dayString + ', ' + key
            }
        }

        return (
            <FormattedMessage
                id='calendar.on_date'
                values={{ date: dayString }}
            />
        )
    }

    const renderDates = () => {
        if (!detailDate.btime) return
        if (!new Date(detailDate.btime).getDate()) return
        const fullDate = getFullDate(detailDate.btime)
        const y = Number(fullDate.y)
        const m = Number(fullDate.m)
        const d = Number(fullDate.d)
        const days = (new Date(y, m, 1) - new Date(y, m - 1, 1)) / (86400 * 1000)
        const dateList = new Array(days).fill('')

        return dateList.map((date, index) => {
            const day = index + 1
            return (
                <li
                    key={index}
                    className={`flex justify-center items-center mb-4 mr-3 rounded-full ${repeatDateNumbers[day] ? 'bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'}`}
                    style={{ height: '38px', width: '38px' }}
                    onClick={() => handleSetReapeatDate(day)}
                >
                    <div className='text-sm'>
                        <FormattedDate
                            value={`${m > 9 ? m : '0' + m}-${index + 1 > 9 ? index + 1 : '0' + (index + 1)}`
                            }
                            day="numeric"
                        />
                    </div>
                </li>
            )
        })
    }

    const renderCycleNumberList = () => {
        return new Array(99).fill('').map((d, index) => (
            <li
                key={index}
                className='flex justify-center items-center p-2 bg-gray-light-hover cursor-pointer'
                onClick={() => {
                    setCycleNumber(index + 1)
                    setShowCycleNumberList(false)
                }}
            >
                {index + 1}
            </li>
        ))
    }

    const renderCycleList = () => {
        const cycleList = [
            'never',
            'day',
            'week',
            'month',
            'year'
        ]

        return cycleList.map((cycle, index) => (
            <li
                key={index}
                className='flex items-center p-2 bg-gray-light-hover cursor-pointer'
                onClick={() => {
                    setCycleName(cycle)
                    setShowCycleList(false)
                    if (cycle === 'never') {
                        setDetailDate({ ...detailDate, final_date: parseToISOString(addDays(30)), is_repeat: false })
                    } else {
                        setDetailDate({ ...detailDate, final_date: parseToISOString(addDays(30)), is_repeat: true })
                    }
                }}
            >
                <FormattedMessage id={`calendar.${cycle}`} />
            </li>
        ))
    }

    useEffect(() => {
        if (detailDate.btime) {
            const fullDay = getFullDate(detailDate.btime)
            const d = fullDay.d
            const week = new Date(detailDate.btime).getDay()
            setRepeatDateNumbers({
                [d]: true,
            })
            setRepeatWeekNumbers({
                [week]: weeks[week].name
            })
        }
    }, [detailDate])

    return (
        <>
            {/* 頁首 */}
            <div className={`bg-${tag_color}-500 pl-2 pr-1 flex justify-end`}>
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
            <div className={`bg-${tag_color}-50 pl-8 pr-1 py-1 flex select-none`}>
                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color}-600 hover:bg-${tag_color}-100`}
                    onClick={onSave}
                >
                    <Icon className='mr-2' icon={['far', 'save']} />
                    <span><FormattedMessage id='calendar.save' /></span>
                </div>

                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color}-600 hover:bg-${tag_color}-100 flex flex-nowrap`}
                    onClick={onAbandon}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span><FormattedMessage id='calendar.abandon' /></span>
                </div>

                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color}-600 hover:bg-${tag_color}-100 flex flex-nowrap`}
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
                                className={`absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-10 transition ease-out duration-75 flex`}
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
                                className={`text-${tag_color}-600 mr-2 pb-1 pl-4 flex-grow text-2xl font-semibold border-b border-gray-300 hover:border-gray-600 focus:outline-none`}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-1'>
                                {detailDate.all_day ?
                                    <div className='flex-1'>
                                        <div className='datetimepicker-box flex mb-4'>
                                            <Datetimepicker
                                                name="btime"
                                                value={parseToISOString(detailDate.btime)}
                                                onChange={value => setDetailDate({ ...detailDate, btime: value })}
                                                notime
                                            />
                                        </div>

                                        <div className='datetimepicker-box flex' onBlur={() => setDetailDate({ ...detailDate, etime: detailDate.btime })}>
                                            <Datetimepicker
                                                name="etime"
                                                value={parseToISOString(detailDate.etime)}
                                                min={parseToISOString(detailDate.btime)}
                                                onChange={value => setDetailDate({ ...detailDate, etime: value })}
                                                notime
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div className='flex-1'>
                                        <div className='datetimepicker-box flex mb-4'>
                                            <Datetimepicker
                                                name="btime"
                                                value={parseToISOString(detailDate.btime)}
                                                onChange={value => setDetailDate({ ...detailDate, btime: value })}
                                            />
                                        </div>

                                        <div className='datetimepicker-box flex' onBlur={() => setDetailDate({ ...detailDate, etime: detailDate.btime })}>
                                            <Datetimepicker
                                                name="etime"
                                                value={parseToISOString(detailDate.etime)}
                                                min={parseToISOString(detailDate.btime)}
                                                onChange={value => setDetailDate({ ...detailDate, etime: value })}
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
                                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${detailDate.all_day ? 'bg-blue-500' : 'bg-gray-200'}`}
                                            role="switch"
                                            aria-checked="false"
                                            onClick={() => setDetailDate({ ...detailDate, all_day: !detailDate.all_day })}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${detailDate.all_day ? 'translate-x-5' : 'translate-x-0'}`}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-wrap flex-1 mr-2 relative border-b border-gray-300 hover:border-gray-600'>
                                <div className='flex ml-4 mb-2 rounded-full cursor-pointer bg-blue-50 hover:bg-blue-100'>
                                    <div
                                        className='relative'
                                        style={{ width: '32px', height: '32px' }}
                                    >
                                        <div className='absolute inset-0 rounded-full bg-gray-300'>

                                        </div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className={`pl-2 mr-2 text-${tag_color}`}>Zap Lin</div>
                                        <div
                                            className='relative rounded-full hover:bg-blue-200'
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            <div className='absolute inset-0 flex justify-center items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${tag_color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex ml-4 mb-2 rounded-full cursor-pointer bg-blue-50 hover:bg-blue-100'>
                                    <div
                                        className='relative'
                                        style={{ width: '32px', height: '32px' }}
                                    >
                                        <div className='absolute inset-0 rounded-full bg-gray-300'>

                                        </div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className={`pl-2 mr-2 text-${tag_color}`}>Zap Lin</div>
                                        <div
                                            className='relative rounded-full hover:bg-blue-200'
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            <div className='absolute inset-0 flex justify-center items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${tag_color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type='text'
                                    className='outline-none flex-1 pb-1 pl-4 '
                                />
                            </div>
                        </div>
                    </div>

                    {/* 重複 */}
                    <div className='flex mb-4 flex-wrap select-none'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-wrap flex-1 mr-2 pb-1 pl-4 border-b border-gray-300 hover:border-gray-600'>
                                <div className='flex'>
                                    <div className='mr-2'>
                                        <span className='mr-1'>
                                            <FormattedMessage id='calendar.repeat' />
                                            {cycleName === 'never' ? null : <FormattedMessage id='calendar.interval' />}
                                        </span>
                                        <span>:</span>
                                    </div>

                                    {/* 顯示重複間隔天數 */}
                                    {cycleName === 'never' || cycleName === 'year' ? null : <div
                                        className='calendar-inner-icon-hover mr-2 flex flex-shrink-0 cursor-pointer'
                                        ref={cycleNumberRef}
                                        onClick={() => setShowCycleNumberList(!showCycleNumberList)}
                                    >
                                        <span className='px-2'>{cycleNumber}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                            <FormattedMessage id={`calendar.${cycleName}`} />
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                {cycleName !== 'month' && cycleName !== 'year' ? null : <fieldset className='w-full mt-2'>
                                    <div className="bg-white rounded-md">
                                        {/* 於...日 */}
                                        <label className="relative py-2 flex cursor-pointer">
                                            <input
                                                type="radio"
                                                name="privacy_setting"
                                                value=""
                                                className="mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-gray-900 font-medium flex">
                                                    <span className='mr-2 text-sm'>{renderOnDate()}</span>
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
                                                name="privacy_setting"
                                                value=""
                                                className="mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-gray-900 text-sm font-medium flex flex-wrap mr-2">
                                                    <span className='mr-2 text-sm'>{renderOnWeek()}</span>
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
                                {(showRepeatWeek || (cycleName === 'day' && cycleNumber === 1) || cycleName === 'week') && <div className='w-full mt-2'>
                                    <ul className='flex py-2'>
                                        {weeks.map((day, index) => (
                                            <li
                                                key={index}
                                                className={`flex justify-center items-center mr-3 rounded-full ${repeatWeekNumbers[day.day] ? 'bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                style={{ height: '38px', width: '38px' }}
                                                onClick={() => handleSetRepeatWeek(day.name, day.day)}
                                            >
                                                <div className='text-sm'>{day.abb_name}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>}

                                {/* 重複至 */}
                                {cycleName !== 'never' && <div className='flex w-full mt-2'>
                                    {detailDate.is_repeat && <div className='flex items-center'>
                                        <span className=''>
                                            <FormattedMessage id='calendar.repeat_until' />
                                        </span>
                                    </div>}

                                    {/* 顯示重複的結束日期 */}
                                    {detailDate.is_repeat && <div
                                        className='calendar-inner-icon-hover flex flex-shrink-0 cursor-pointer'
                                    >
                                        <div className='datetimepicker-box-no-borderb flex' onBlur={() => setDetailDate({ ...detailDate, etime: detailDate.btime })}>
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
                                            className='flex items-center text-sm text-blue-500 cursor-pointer'
                                            onClick={() => {
                                                setDetailDate({ ...detailDate, final_date: '0001-01-01T00:00:00', is_repeat: false })
                                            }}
                                        >
                                            <FormattedMessage id='calendar.remove_end_date' />
                                        </div>
                                        :
                                        <div
                                            className='flex items-center text-sm text-blue-500 cursor-pointer'
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </div>
                            <textarea
                                className='border border-gray-300 w-full h-32'
                                style={{ padding: '8px' }}
                                value={detailDate.desc}
                                onChange={e => setDetailDate({
                                    ...detailDate,
                                    desc: e.target.value,
                                })}
                            />
                        </div>
                    </div>
                </div>
                <div className='p-2 pr-4'></div>
            </div>
        </>
    );
};

export default EditorNote;