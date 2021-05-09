import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl';
import { createPortal } from 'react-dom'
import { getFullDate, parseToDateString, parseToISOString } from 'lib/datetime'
import { Datetimepicker } from '@iqs/datetimepicker'
import '@iqs/datetimepicker/index.styl'
import { colorMap } from './formatDate'

const EditorNote = ({
    calendarData, // 整個行程陣列資料
    setCalendarData, // 將資料傳出去
    detailDate,
    setDetailDate,
    handleClose,
}) => {

    const [showCategory, setShowCategory] = useState(false)
    const tag_color = colorMap[detailDate.tag_color]

    const categoryRef = useRef()
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
        return (
            <li
                key={index}
                className={`flex flex-nowrap items-center pl-2 py-2 pr-8 hover:bg-gray-100 cursor-pointer`}
                onClick={() => setDetailDate({ ...detailDate, tag_color: data.hexColor.toLowerCase() })}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-${data.name}-500`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>
                    <FormattedMessage id={`calendar.category.${data.name}`} />
                </span>
            </li>
        )
    }

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
                    <span className='px-2'>{console.log('detailDate', detailDate)}
                        <FormattedMessage id={`calendar.category.${tag_color}`} />
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>

                    {!showCategory ? null : createPortal(
                        <div className={`fixed h-full w-full top-0 z-10`}>
                            <div className='fixed h-full w-full top-0 left-0' onClick={() => setShowCategory(false)}></div>
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
                                className={`text-${tag_color}-600 mr-2 pb-1 pl-2 flex-grow text-2xl font-semibold border-b border-gray-300 focus:outline-none`}
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
                        <div></div>
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