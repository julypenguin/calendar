import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'

import '../styl/index.styl'
import '../styl/styles.css'
import Navbar from './Navbar'
import CalendarM from './CalendarM'
import CalendarD from './CalendarD'
import { getFullDate } from 'lib/datetime'
import EditorNote from './EditorNote'

import testData from './data.json'

const App = (props) => {
    const { intl: { language } } = props

    const [showData, setShowData] = useState(new Date().toISOString())
    const [cycle, setCycle] = useState(7) // 1: 1天, 2:2天, 3:3天, 4:4天, 5:5天, 6:6天, 7:7天, 30: 1月, 77:1週

    const isWeek = cycle === 77 ? true : false

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

    const renderDate = (dateTime) => {
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
                    formatDate: <FormattedDate
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
                formatDate: !isToday ? null : <FormattedDate
                    value={`${m + 1}-${i}`}
                    month="long"
                    day="2-digit"
                />,
                main: true,
            })
        }

        // 紀錄下個月有哪幾天(如果這個月的最後一天不是禮拜六才會紀錄)
        if (new Date(y, m, days).getDay() != 6) {
            for (let i = 1; i < 7 - new Date(y, m, days).getDay(); i++) {
                const newY = new Date(y, m + 1, 1).getFullYear()
                const newM = new Date(y, m + 1, 1).getMonth() + 1
                const newD = i
                arr.push({
                    date: newD,
                    month: newM,
                    year: newY,
                    isOverdue: checkOverdue({ y: newY, m: newM, d: newD, todayY, todayM, todayD }),
                    isToday: checkOverdue({ y: newY, m: newM, d: newD, todayY, todayM, todayD }, true),
                    formatDate: <FormattedDate
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

    return (
        <IntlProvider defaultLocale='zh' {...language}>
            {/* <EditorNote /> */}
            <div className='h-full w-full absolute'>
                <div className='h-full w-full overflow-hidden flex flex-col relative'>
                    <Navbar
                        {...props}
                        showData={showData}
                        setShowData={setShowData}
                        renderDate={renderDate}
                        cycle={cycle}
                        setCycle={setCycle}
                    />

                    {cycle === 30 ?
                        <CalendarM
                            {...props}
                            showData={showData}
                            setShowData={setShowData}
                            renderDate={renderDate}
                            calendarData={testData}
                            isMonth={cycle === 30}
                            canEdit
                        />
                        :
                        <CalendarD
                            {...props}
                            showData={showData}
                            setShowData={setShowData}
                            cycle={cycle}
                            isWeek={isWeek}
                            calendarData={testData}
                        />
                    }

                </div>
            </div>

        </IntlProvider>
    );
};

export default App;