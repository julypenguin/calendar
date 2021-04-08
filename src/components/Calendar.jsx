import React, { useEffect, useState } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import '../styl/styles.css'
import { getFullDate } from 'lib/datetime'

const Calendar = ({
    intl,
    showData,
    setShowData,
    renderDate,
    abbr, // 讓 calendar 保持所寫文字
    textSm, // 讓文字變小
    center, // 文字置中
    canClick, // 點擊後會選取
}) => {

    const getIntlMsg = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage })

    const msgintl = {
        monday: getIntlMsg('calendar.monday', '星期一'),
        mon: getIntlMsg('calendar.mon', '一'),
        tuesday: getIntlMsg('calendar.tuesday', '星期二'),
        tue: getIntlMsg('calendar.tue', '二'),
        wednesday: getIntlMsg('calendar.wednesday', '星期三'),
        wed: getIntlMsg('calendar.wed', '三'),
        thursday: getIntlMsg('calendar.thursday', '星期四'),
        thu: getIntlMsg('calendar.thu', '四'),
        friday: getIntlMsg('calendar.friday', '星期五'),
        fri: getIntlMsg('calendar.fri', '五'),
        saturday: getIntlMsg('calendar.saturday', '星期六'),
        sat: getIntlMsg('calendar.sat', '六'),
        sunday: getIntlMsg('calendar.sunday', '星期日'),
        sun: getIntlMsg('calendar.sun', '日'),
    }

    const weeks = [
        { name: msgintl.monday, abb_name: msgintl.mon },
        { name: msgintl.tuesday, abb_name: msgintl.tue },
        { name: msgintl.wednesday, abb_name: msgintl.wed },
        { name: msgintl.thursday, abb_name: msgintl.thu },
        { name: msgintl.friday, abb_name: msgintl.fri },
        { name: msgintl.saturday, abb_name: msgintl.sat },
        { name: msgintl.sunday, abb_name: msgintl.sun },
    ]



    // useEffect(() => {
    //     if ()
    // }, [date])


    return (
        <>
            <div className="relative flex flex-1 w-full h-full">
                {/* 大月曆 */}
                <div className="inset-0 absolute flex flex-col">
                    <div className='flex flex-1 select-none' style={{ height: '48px' }}>
                        {weeks.map((week, index) => (
                            <div key={index} className="relative flex flex-1 text-xs px-4 items-end mb-4">
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
                    <div
                        className={`relative height-full flex-row overflow-visible bg-gray-100`}
                        style={{ flex: '1 1 100%' }}
                    >
                        {renderDate(showData).map((week, index, datas) => (
                            // <div key={index} className="">
                            week.map((data, i) => (
                                <div
                                    key={i}
                                    className={` py-2 whitespace-nowrap text-sm font-medium text-gray-900 absolute border-t cursor-pointer ${data.isToday ? 'calendar-today' : data.isOverdue ? 'bg-gray-100' : 'bg-white'}`}
                                    style={{
                                        inset: `
                                            ${index * (100 / datas.length).toFixed(4)}% 
                                            ${(100 / 7 * (6 - i)).toFixed(4)}% 
                                            ${100 - (100 / datas.length) * (index + 1)}% 
                                            ${(100 / 7 * (i)).toFixed(4)}%`
                                    }}
                                >
                                    <div className={`flex flex-col w-full h-full overflow-hidden ${data.isOverdue ? 'bg-gray-100' : 'bg-white'}`}>
                                        <div className={`px-4 top w-full ${!center ? '' : 'flex justify-center items-center h-full'}`}>
                                            {data.formateDate ?
                                                abbr ?
                                                    <div className={`text-gray-500 ${!textSm ? '' : 'text-xs'}`}>{data.date}</div>
                                                    :
                                                    <>
                                                        <div className={`text-gray-500 hidden md:block ${!textSm ? '' : 'text-xs'}`}>{data.formateDate}</div>
                                                        <div className={`text-gray-500 md:hidden ${!textSm ? '' : 'text-xs'}`}>{data.date}</div>
                                                    </>

                                                :
                                                <span className={`text-gray-500 ${!textSm ? '' : 'text-xs'}`}>{data.date}</span>
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
                            // </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default injectIntl(Calendar);