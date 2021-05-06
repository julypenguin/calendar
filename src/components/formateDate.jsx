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

export const colorMap = {
    "#E5E7EB": "gray",
    "#FECACA": "red",
    "#FDE68A": "yellow",
    "#A7F3D0": "green",
    "#BFDBFE": "blue",
    "#C7D2FE": "indigo",
    "#DDD6FE": "purple",
    "#FBCFE8": "pink",
    "#76C4AE": "bewitched-tree",
    "#9FC2BA": "mystical-green",
    "#BEE9E4": "light-heart",
    "#7CE0F9": "glass-gall",
    "#CAECCF": "silly-fizz",
    "#D3D2B5": "brain-sand",
    "#CABD80": "mustard-addicted",
    "#E1CEB1": "magic-powder",
    "#DDB0A0": "true-blush",
    "#D86C70": "merry-cranesbill",
}

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
