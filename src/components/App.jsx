import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { ConnectedRouter } from 'connected-react-router'
import '../styl/index.styl'
import '../styl/styles.css'
import Navbar from './Navbar'
import CalendarM from '../containers/CalendarM'
import CalendarD from '../containers/CalendarD'
import { getFullDate } from 'lib/datetime'
import uuid from 'lib/uuid'
import EditorNote from './EditorNote'

// import testData from './data.json'
// import data from './data2.json'

const App = (props) => {
    const { intl: { language }, history } = props

    const [testData, setTestData] = useState([])
    const [showData, setShowData] = useState(new Date().toISOString())
    const [cycle, setCycle] = useState(30) // 1: 1天, 2:2天, 3:3天, 4:4天, 5:5天, 6:6天, 7:7天, 30: 1月, 77:1週

    const isWeek = cycle === 77 ? true : false

    // const testData = data.data.reduce((accList, schedual) => {
    //     const newSchedual = schedual.display_dates.map(((dete, index) => {
    //         const newUuid = uuid()
    //         // console.log('newUuid', newUuid)
    //         // console.log('btime', dete.start_time)
    //         return {
    //             sid: schedual.evt_sid || 0,
    //             title: schedual.title || '',
    //             btime: dete.start_time || new Date(),
    //             etime: dete.end_time || new Date(),
    //             start_time: schedual.start_time || new Date(),
    //             end_time: schedual.end_time || new Date(),
    //             final_date: schedual.final_date || new Date(),
    //             desc: schedual.detail || '',
    //             tag_color: schedual.color || '',
    //             all_day: schedual.is_allday || false,
    //             uuid: uuid(),
    //         }
    //     }))

    //     return [...accList, ...newSchedual]
    // }, [])

    // console.log('testData', testData)

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
                    datetime: new Date(newY, newM - 1, newD)
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
                datetime: new Date(y, m, i)
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
                    datetime: new Date(newY, newM, newD)
                })
            }
        }

        const week = []
        for (let i = 0; i < arr.length; i += 7) {
            week.push(arr.slice(i, i + 7).map(date => ({ ...date, level: (i / 7) + 1 })))
        }
        // console.log('week', week)
        return week
    }

    useEffect(() => {
        const options = {
            headers: {
                'Accept': '*',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
        }

        // fetch("https://support6-dev.iqs-t.com/api/core/login", {
        //     ...options,
        //     method: 'POST',
        //     body: JSON.stringify({
        //         account: 'iqadmin',
        //         password: '1111',
        //         ao_sid: '15',
        //     }),
        // }).then(res => {
        //     console.log('login', res)
        // })
        fetch('https://support6-dev.iqs-t.com/teamweb/api/teamweb/calendar?start_time=2021-04-20&end_time=2021-09-21', {
            ...options,
        }).then(res => {
            return res.json()
        }).then(res => {
            const tmpData = res.data && res.data.reduce((accList, schedual) => {
                const newSchedual = schedual.display_dates.map(((dete, index) => {
                    const newUuid = uuid()
                    // console.log('newUuid', newUuid)
                    // console.log('btime', dete.start_time)
                    return {
                        sid: schedual.evt_sid || 0,
                        title: schedual.title || '',
                        btime: dete.start_time || new Date(),
                        etime: dete.end_time || new Date(),
                        start_time: schedual.start_time || new Date(),
                        end_time: schedual.end_time || new Date(),
                        final_date: schedual.final_date || new Date(),
                        desc: schedual.detail || '',
                        tag_color: schedual.color || '',
                        all_day: schedual.is_allday || false,
                        uuid: uuid(),
                    }
                }))

                return [...accList, ...newSchedual]
            }, [])

            setTestData(tmpData)
        })

    }, [])

    return (
        <IntlProvider defaultLocale='zh' {...language}>
            <ConnectedRouter history={history}>
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
            </ConnectedRouter>

        </IntlProvider>
    );
};

export default App;