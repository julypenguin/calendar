import React, { useState, useEffect } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { getFullDate } from 'lib/datetime'

const SelectorM = ({
    month,
    defaultData,
    setDefaultData,
    renderFullDate,
    setOtherData,
    cycle,
    onClose={onClose}
}) => {
    const [previewData, setPreviewData] = useState(new Date())
    const [mode, setMode] = useState(1) // 1:month, 2:year

    const handleSetMonth = month => {
        // setShowData(`${data.year}-${data.month}-${data.date}`)
        const date = new Date(previewData)
        date.setMonth(month)
        const fullDate = getFullDate(date)
        const fullDateDefault = getFullDate(defaultData)
        const fullDateToday = getFullDate()

        if (fullDate.y === fullDateToday.y && fullDate.m === fullDateToday.m) {
            date.setDate(fullDateToday.d)
        } else {
            date.setDate(1)
        }

        setPreviewData(date)
        if (typeof setDefaultData === 'function') setDefaultData(date)
        if (typeof setOtherData === 'function' && cycle === 30) {
            if (fullDate.y === fullDateDefault.y && fullDate.m === fullDateDefault.m) return
            setOtherData(date)
            if (typeof onClose === 'function') onClose()
        } 
    }

    const handleSetYear = year => {
        const date = new Date(previewData)
        date.setFullYear(year)
        setPreviewData(date)
        if (typeof setDefaultData === 'function') setDefaultData(date)
        setMode(1)
    }

    //option=1: month, option=2: year
    const selectYearOrMonth = (setData, data, option) => {
        const fullDate = getFullDate(data)
        // const fullDateSelected = getFullDate(data)
        const y = Number(fullDate.y)
        const selectedY = Number(fullDate.y)
        const m = Number(fullDate.m)
        const selectedM = Number(fullDate.m)
        const yearOrMonthArr = new Array(12).fill('')
        const newArray = new Array(3).fill('')

        if (option === 1) {
            const newMonth = yearOrMonthArr.map((data, index) => {
                return {
                    month: index + 1,
                    level: Math.floor(index / 4),
                }
            })

            return newArray.map((data, index) => {
                return <div key={index} className='mb-2' role='row'>
                    {newMonth.filter(d => d.level === index)
                        .map(d => (
                            <div
                                key={d.month}
                                className={`mr-1 text-xs text-center inline-block cursor-pointer ${d.month === selectedM && y === selectedY ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'}`}
                                role='gridcell'
                                style={{ width: '40px', height: '40px', lineHeight: '40px' }}
                                onClick={() => handleSetMonth(d.month - 1)}
                            >
                                <FormattedDate
                                    value={`${d.month}-01`
                                    }
                                    month="numeric"
                                />
                            </div>
                        ))}
                </div>
            })
        }

        if (option === 2) {
            const level = Math.floor(y / 12)
            const newYearStart = (12 * level) + 4
            const newYear = yearOrMonthArr.map((data, index) => {
                return {
                    year: newYearStart + index,
                    level: Math.floor(index / 4),
                }
            })
            return newArray.map((data, index) => {
                return <div key={index} className='mb-2' role='row'>
                    {newYear.filter(d => d.level === index)
                        .map(d => (
                            <div
                                key={d.year}
                                className={`mr-1 text-xs text-center inline-block cursor-pointer ${d.year === y ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'}`}
                                role='gridcell'
                                style={{ width: '40px', height: '40px', lineHeight: '40px' }}
                                onClick={() => handleSetYear(d.year)}
                            >
                                {d.year}
                            </div>
                        ))}
                </div>

            })

        }

    }

    const setYear = (setData, data, calc) => {
        const todayToFullDate = getFullDate()
        const todayY = Number(todayToFullDate.y)
        const todayM = Number(todayToFullDate.m)
        const todayD = todayToFullDate.d
        if (!calc && calc !== 0) {
            const newShowDate = `${todayY}-${todayM}-${todayD}`
            if (typeof setData === 'function') setData(newShowDate)
            return
        }
        const fullDate = getFullDate(data)

        let y = Number(fullDate.y) + calc
        let m = Number(fullDate.m)
        const d = (todayY === y && todayM === m) ? todayD : '1'

        const newShowDate = `${y}-${m}-${d}`
        if (typeof setData === 'function') setData(newShowDate)
    }

    useEffect(() => {
        if (defaultData) setPreviewData(defaultData)
    }, [defaultData])

    return (
        <div className='flex flex-col select-none'>
            <div className='px-2 pt-2 pb-1 overflow-hidden' style={{ width: '196px' }}>
                <div className='flex'>
                    <div
                        className='flex-1 pl-2 pr-5 hover:bg-gray-100 cursor-pointer'
                        onClick={() => setMode(mode === 1 ? 2 : 1)}
                    >
                        {renderFullDate({ data: previewData, noMonth: true, noDate: true, rangeY: mode === 2 })}
                    </div>
                    <div className='flex'>
                        <div
                            className='flex justify-center items-center cursor-pointer hover:bg-gray-100' style={{ width: '28px', height: '28px' }}
                            onClick={() => mode === 2 ? setYear(setPreviewData, previewData, -12) : setYear(setPreviewData, previewData, -1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <div
                            className='flex justify-center items-center cursor-pointer hover:bg-gray-100'
                            style={{ width: '28px', height: '28px' }}
                            onClick={() => mode === 2 ? setYear(setPreviewData, previewData, 12) : setYear(setPreviewData, previewData, 1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mt-1' role='grid'>
                        {selectYearOrMonth(setPreviewData, previewData, mode)}
                    </div>
                </div>
            </div>
            {cycle === 30 ? null : <div className='text-right px-6 text-xs hover:text-blue-400 cursor-pointer'>今天</div>}
        </div>
    );
};

export default SelectorM;