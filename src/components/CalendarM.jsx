import React, { useEffect, useState } from 'react';
import classNames from 'classnames'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import '../styl/styles.css'
import { getFullDate, filterDate, dateDiff } from 'lib/datetime'
import { weeks } from './formateDate'

const CalendarM = (props) => {
    const {
        showData,
        setShowData,
        renderDate,
        setOtherData,
        onClose,
        abbr, // 讓 calendar 保持所寫文字
        textSm, // 讓文字變小
        center, // 文字置中
        selector, // 點擊後會選取
        calendarData, // 從外部填入日曆的資料
        isMonth,
    } = props

    const fullDate = getFullDate(showData)

    const newCalendarData = calendarData && calendarData.data.filter((date) => filterDate({ ...props, ...date, dayCount: 30 })) || []

    const handleSetDate = data => {
        setShowData(`${data.year}-${data.month}-${data.date}`)
        if (typeof setOtherData === 'function') setOtherData(`${data.year}-${data.month}-${data.date}`)
        if (typeof onClose === 'function') onClose()
    }

    const formatCalendarData = (data) => {
        const weeks = renderDate(showData)
        if (!Array.isArray(data)) return []
        data.reduce((acc, date) => {
            weeks.map((week, index, arr) => {
                const firstFullDay = week[0]
                const lastFullDay = week[arr.length - 1]
                const firstDate = new Date(firstFullDay.year, firstFullDay.month - 1, firstFullDay.date)
                const lastDate = new Date(lastFullDay.year, lastFullDay.month - 1, lastFullDay.date)
                const dateB = new Date(date.btime)
                const dateE = new Date(date.etime)

                const before = dateB < firstDate && dateE > firstDate
                const between = dateB > firstDate && dateE < lastDate
                const future = dateB < lastDate && dateE > lastDate
                const contain = dateB < firstDate && dateE > lastDate

                if (between) {
                    week.map((date) => {

                    })
                }

                return {
                    top: ``,
                    right: `${future || contain ? '0' : ''}`,
                    left: `${before || contain ? '0' : '' }`,
                }
            })
        }, [])
        console.log('weeks!!!', weeks)
    }

    const renderNotes = () => {
        formatCalendarData(newCalendarData)
        const notes = newCalendarData.map((date) => (
            <div draggable='true'>
                <div className='absolute cursor-pointer box-border' style={{ left: '14.2857%', right: '42.8571%', top: `calc(60% + 34px)`, height: '23px' }}>今天</div>
            </div>
        ))

        return (
            <div draggable='true'>
                <div className='absolute cursor-pointer box-border bg-blue-300 mr-2 rounded opacity-70 text-blue-800' style={{ left: '14.2857%', right: '42.8571%', top: 'calc(60% + 34px)', height: '23px' }}>
                    <div className='px-2 truncate'>今天</div>
                </div>
            </div>
        )
    }

    return (
        <>
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
                                    className={`whitespace-nowrap text-sm font-medium text-gray-900 absolute cursor-pointer ${Number(data.date) === Number(fullDate.d) && Number(data.month) === Number(fullDate.m) && Number(data.year) === Number(fullDate.y) ? 'bg-blue-200 opacity-70' : 'bg-white hover:bg-gray-100'}
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
                                    <div className={`py-2 flex flex-col w-full h-full overflow-hidden ${selector && data.isToday ? 'rounded-full bg-blue-600' : ''} `}>
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
                                        {/* {!center &&
                                            data.date === 19 && <div className="px-2 bottom flex-grow h-30 py-1 w-full cursor-pointer">
                                                <div
                                                    className="event text-blue-600 rounded p-1 text-sm mb-1 hover:bg-blue-100 leading-6"
                                                >
                                                    <div className="event-name truncate">下午 2 【充電時間：打造你的關鍵三力】</div>
                                                </div>
                                            </div>
                                        } */}
                                    </div>
                                </div>
                            ))
                        ))}
                        {renderNotes()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CalendarM;