import React, { useEffect, useState } from 'react';
import classNames from 'classnames'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import '../styl/styles.css'
import { getFullDate } from 'lib/datetime'
import { weeks } from './formateDate'

const CalendarM = ({
    intl,
    showData,
    setShowData,
    renderDate,
    abbr, // 讓 calendar 保持所寫文字
    textSm, // 讓文字變小
    center, // 文字置中
    selector, // 點擊後會選取
}) => {

    const fullDate = getFullDate(showData)

    const isToday = data => {
        return Number(data.date) === Number(fullDate.d) && Number(data.month) === Number(fullDate.m) && Number(data.year) === Number(fullDate.y)
    }

    const selectedClassName = data => {
        classNames('table-row-canclick',
            {
                'bg-blue-200': isToday(data)
            }
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
                                    className={`whitespace-nowrap text-sm font-medium text-gray-900 absolute cursor-pointer ${Number(data.date) === Number(fullDate.d) && Number(data.month) === Number(fullDate.m) && Number(data.year) === Number(fullDate.y) ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'}
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
                                    onClick={() => setShowData(`${data.year}-${data.month}-${data.date}`)}
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
                                        {!center &&
                                            data.date === 19 && <div className="px-2 bottom flex-grow h-30 py-1 w-full cursor-pointer">
                                                <div
                                                    className="event text-blue-600 rounded p-1 text-sm mb-1 hover:bg-blue-100 leading-6"
                                                >
                                                    <div className="event-name truncate">下午 2 【充電時間：打造你的關鍵三力】</div>
                                                </div>
                                                {/* <div
                                                    className="event bg-purple-400 text-white rounded p-1 text-sm mb-1"
                                                >
                                                    <span className="event-name">Meeting</span>
                                                    <span className="time">12:00~14:00</span>
                                                </div> */}
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default injectIntl(CalendarM);