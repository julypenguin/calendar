import React, { useEffect, useState } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { getFullDate, addDays } from 'lib/datetime'

export const weeks = [
    {
        name: <FormattedMessage id='calendar.sunday' />,
        abb_name: <FormattedMessage id='calendar.sun' />,
        week_name: <FormattedMessage id='calendar.week_sun' />
    },
    {
        name: <FormattedMessage id='calendar.monday' />,
        abb_name: <FormattedMessage id='calendar.mon' />,
        week_name: <FormattedMessage id='calendar.week_mon' />
    },
    {
        name: <FormattedMessage id='calendar.tuesday' />,
        abb_name: <FormattedMessage id='calendar.tue' />,
        week_name: <FormattedMessage id='calendar.week_tue' />
    },
    {
        name: <FormattedMessage id='calendar.wednesday' />,
        abb_name: <FormattedMessage id='calendar.wed' />,
        week_name: <FormattedMessage id='calendar.week_wed' />
    },
    {
        name: <FormattedMessage id='calendar.thursday' />,
        abb_name: <FormattedMessage id='calendar.thu' />,
        week_name: <FormattedMessage id='calendar.week_thu' />
    },
    {
        name: <FormattedMessage id='calendar.friday' />,
        abb_name: <FormattedMessage id='calendar.fri' />,
        week_name: <FormattedMessage id='calendar.week_fri' />
    },
    {
        name: <FormattedMessage id='calendar.saturday' />,
        abb_name: <FormattedMessage id='calendar.sat' />,
        week_name: <FormattedMessage id='calendar.week_sat' />
    },
]

export const calendarType = {
    0: <>
        <span className='mr-1'></span><FormattedMessage id='calendar.day' />
    </>,
    1: <>
        <span className='mr-1'>1</span><FormattedMessage id='calendar.day' />
    </>,
    2: <>
        <span className='mr-1'>2</span><FormattedMessage id='calendar.day' />
    </>,
    3: <>
        <span className='mr-1'>3</span><FormattedMessage id='calendar.day' />
    </>,
    4: <>
        <span className='mr-1'>4</span><FormattedMessage id='calendar.day' />
    </>,
    5: <>
        <span className='mr-1'>5</span><FormattedMessage id='calendar.day' />
    </>,
    6: <>
        <span className='mr-1'>6</span><FormattedMessage id='calendar.day' />
    </>,
    7: <>
        <span className='mr-1'>7</span><FormattedMessage id='calendar.day' />
    </>,
    30: <FormattedMessage id='calendar.month' />,
    77: <FormattedMessage id='calendar.week' />,
}

export const renderFullDate = ({ data, noYear, noMonth, noDate, rangeY, rangeDtoWeek, className }) => {
    const fullDate = getFullDate(data)
    const levelY = Math.floor(fullDate.y / 12)
    const newY = rangeY ? `${(12 * levelY) + 4} - ${(12 * levelY) + 15}` : `${fullDate.y}`
    const prevDaysCount = new Date(data).getDay()
    const earliestDate = getFullDate(addDays(0 - prevDaysCount, data))
    const latestDate = getFullDate(addDays(6 - prevDaysCount, data))

    return <>
        {!rangeDtoWeek ? <>
            {noYear ? null : <span className={`mr-1 ${className ? className : 'text-lg'}`}>{newY}</span>}
            {noMonth ? null : <span className={`mr-1 ${className ? className : 'text-lg'}`}>
                <FormattedDate
                    value={`${fullDate.y}-${fullDate.m}`
                    }
                    month="numeric"
                />
            </span>}
            {noDate ? null : <span className={`${className ? className : 'text-lg'}`}>
                <FormattedDate
                    value={`${fullDate.y}-${fullDate.m}-${fullDate.d}`
                    }
                    day="numeric"
                />
            </span>}
        </>
            :
            <span className={`mr-1 ${className ? className : 'text-lg'}`}>
                <FormattedDate
                    value={`${earliestDate.y}-${earliestDate.m}-${earliestDate.d}`
                    }
                    year="numeric"
                    month="long"
                    day="numeric"
                />
                <span className='mr-1'>-</span>
                <FormattedDate
                    value={`${latestDate.y}-${latestDate.m}-${latestDate.d}`
                    }
                    year={earliestDate.y === latestDate.y ? undefined : "numeric"}
                    month={earliestDate.m === latestDate.m ? undefined : "long"}
                    day="numeric"
                />
            </span>
        }

    </>
}

const checkOverdue = ({ y, m, d, todayY, todayM, todayD }, checkToday) => {
    if (checkToday) {
        if (Number(y) === todayY && Number(m) === todayM && Number(d) === todayD) return true
        return false
    }
    if (y > todayY) return false
    if (y < todayY) return true
    if (m > todayM) return false
    if (m < todayM) return true
    if (d < todayD) return true

    return false
}

export function renderCalendarMonthDate(dateTime) {
    const fullDate = getFullDate(dateTime)
    const y = fullDate.y
    const m = fullDate.m - 1
    const todayY = new Date().getFullYear()
    const todayM = new Date().getMonth() + 1
    const todayD = new Date().getDate()
    const days = (new Date(y, m + 1, 1) - new Date(y, m, 1)) / (86400 * 1000)
    const arr = []
    // 紀錄上個月有哪幾天(如果這個月不是從星期天開始才會紀錄)
    if (new Date(y, m, 1).getDay() != 0) {
        const lastdays = (new Date(y, m, 1) - new Date(y, m - 1, 1)) / (86400 * 1000)
        for (let i = new Date(y, m, 1).getDay() - 1; i >= 0; i--) {
            const newY = new Date(y, m - 1, 1).getFullYear()
            const newM = new Date(y, m - 1, 1).getMonth() + 1
            const newD = lastdays - i
            arr.push({
                date: newD,
                month: newM,
                year: newY,
                isOverdue: checkOverdue({ y: newY, m: newM, d: newD, todayY, todayM, todayD }),
                isToday: checkOverdue({ y: newY, m: newM, d: newD, todayY, todayM, todayD }, true),
                formateDate: <FormattedDate
                    value={`${newM}-${newD}`}
                    month="long"
                    day="2-digit"
                />,
                main: false,
            })
        }
    }

    // 紀錄這個月有哪幾天
    for (let i = 1; i <= days; i++) {
        const isToday = checkOverdue({ y, m: m + 1, d: i, todayY, todayM, todayD }, true)
        arr.push({
            date: i,
            month: m + 1,
            year: y,
            isOverdue: checkOverdue({ y, m: m + 1, d: i, todayY, todayM, todayD }),
            isToday,
            formateDate: !isToday ? null : <FormattedDate
                value={`${m + 1}-${i}`}
                month="long"
                day="2-digit"
            />,
            main: true,
        })
    }

    // 紀錄下個月有哪幾天(如果這個月的最後一天不是禮拜六才會紀錄)
    let i = 1
    if (new Date(y, m, days).getDay() != 6) {
        for (i; i < 7 - new Date(y, m, days).getDay(); i++) {
            const newY = new Date(y, m + 1, 1).getFullYear()
            const newM = new Date(y, m + 1, 1).getMonth() + 1
            const newD = i
            arr.push({
                date: newD,
                month: newM,
                year: newY,
                isOverdue: checkOverdue({ y: newY, m: newM, d: newD, todayY, todayM, todayD }),
                isToday: checkOverdue({ y: newY, m: newM, d: newD, todayY, todayM, todayD }, true),
                formateDate: <FormattedDate
                    value={`${newM}-${newD}`}
                    month="long"
                    day="2-digit"
                />,
                main: false,
            })
        }
    }

    const week = []
    for (let i = 0; i < arr.length; i += 7) {
        week.push(arr.slice(i, i + 7))
    }
    console.log('week', week)
    return week
}