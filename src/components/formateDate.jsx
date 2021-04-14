import React, { useEffect, useState } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { getFullDate } from 'lib/datetime'

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

export const renderFullDate = ({ data, noYear, noMonth, noDate, range, className }) => {
    const fullDate = getFullDate(data)
    const levelY = Math.floor(fullDate.y / 12)
    const newY = range ? `${(12 * levelY) + 4} - ${(12 * levelY) + 15}` : `${fullDate.y}`
    return <>
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
}