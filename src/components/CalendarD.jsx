import React, { useEffect, useState, useRef } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { renderFullDate } from './formateDate'
import { getFullDate, addDays } from 'lib/datetime'
import { weeks } from './formateDate'

const CalendarD = ({
    showData,
    setShowData,
    isWeek,
    cycle,
    testData,
}) => {
    const [days, setDays] = useState(1)

    const timeRef = useRef()

    const hourArr = new Array(23).fill('')
    const hourLineArr = new Array(47).fill('')

    const renderDaysTitle = (days) => {
        const dayArr = []

        if (isWeek) {
            const prevDaysCount = new Date(showData).getDay()

            for (let i = 0; i <= prevDaysCount; i++) {
                dayArr.push(addDays(i - prevDaysCount, showData).toISOString())
            }

            for (let i = 1; i <= 6 - prevDaysCount; i++) {
                dayArr.push(addDays(i, showData).toISOString())                
            }
        } else {
            for (let i = 0; i < days; i++) {
                dayArr.push(addDays(i, showData).toISOString())
            }
        }

        return dayArr.map((data, index) => (
            <div
                key={index}
                className='mr-0 border-r border-b border-l flex-col flex-shrink-0'
                style={{ flexBasis: `${(100 / days).toFixed(4)}%` }}
            >
                <div className='flex flex-row flex-nowrap items-end' style={{ padding: '10px 0 0 10px', marginBottom: '8px' }}>
                    <div className='whitespace-nowrap overflow-hidden' style={{ marginRight: '8px', flex: '0 0 auto' }}>{renderFullDate({ data: data, noYear: true, noMonth: true, className: 'text-2xl' })}</div>
                    <div className='' style={{ marginBottom: '2px' }}>{weeks[index].week_name}</div>
                </div>
            </div>
        ))

    }

    const renderNote = (days) => {
        const noteArr = []
        for (let i = 0; i < days; i++) {
            noteArr.push(addDays(i, showData).toISOString())
        }

        const fullDateB = getFullDate(testData.data[0].btime)
        const fullDateE = getFullDate(testData.data[0].etime)
        const minB = Number(fullDateB.h) * 60 + Number(fullDateB.mm)
        const minE = Number(fullDateE.h) * 60 + Number(fullDateE.mm)
        const secPercent = (100 / 1440).toFixed(4)

        return noteArr.map((data, index) => (
            <div key={index} className='border-l border-r relative border-box flex-shrink-0' style={{ minWidth: '80px', flexBasis: `${(100 / days).toFixed(4)}%` }}>
                {index === 8 ? null : (
                    <div className='absolute left-0 top-0 bottom-0' style={{ right: '10px', minWidth: '6px' }}>
                        <div draggable='true'>
                            <div 
                                className='absolute bg-blue-200 cursor-pointer opacity-70 box-border border-l-4 border-blue-600' 
                                style={{ inset: `${secPercent * minB}% 0% ${100 - (secPercent * minE)}%` }}
                            >

                            </div>
                        </div>
                    </div>
                )}
            </div>
        ))
    }

    // 讓時間區也一起滾動
    const onScroll = e => {
        const element = e.target
        timeRef.current.scrollTop = element.scrollTop
    }

    useEffect(() => {
        if (cycle === 77) setDays(7)
        else if (cycle > 0 && cycle < 8) setDays(cycle)
    }, [cycle])

    return (
        <div className="relative flex flex-1 w-full h-full">
            {/* 大月曆(日) */}
            <div className="inset-0 absolute flex flex-col">
                {/* 日期、星期 */}
                <div className='flex flex-shrink-0'>
                    <div className='flex flex-shrink-0 bg-white'>
                        <div className='text-center whitespace-nowrap z-10 flex flex-col flex-end' style={{ width: '59px', padding: '10px 0 4px 0' }}></div>
                    </div>
                    <div className='overflow-hidden flex flex-1' style={{ paddingRight: '18px', paddingLeft: '10px', marginLeft: '-10px', height: '48px', minWidth: '80px' }}>
                        {renderDaysTitle(days)}
                    </div>
                </div>
                {/* 行程 */}
                <div className='flex relative overflow-hidden flex-1 z-0'>
                    {/* 時間 */}
                    <div className='overflow-hidden flex-shrink-0 bg-white' ref={timeRef}>
                        <div className='flex'>
                            <div className='flex flex-shrink-0 flex-grow-0 flex-col relative' style={{ height: '1440px', width: '59px' }}>
                                {hourArr.map((data, index) => (
                                    <div key={index} className='text-right w-full absolute' style={{ top: `${(100 / 24) * (index + 1)}%` }}>
                                        <div className='relative' style={{ bottom: '8px', marginRight: '11px' }}>
                                            <div className='text-xs'>上午 {index + 1}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className='relative flex flex-1'
                        style={{ paddingRight: '18px', paddingLeft: '2px', marginLeft: '-2px', overflow: 'overlay' }}
                        onScroll={onScroll}
                    >
                        <div className='flex flex-1' style={{ height: '1440px' }}>
                            <div className='relative flex flex-1 w-full'>
                                {hourLineArr.map((line, index) => (
                                    <div key={index} className={`absolute left-0 right-0 border-t ${index % 2 === 1 ? 'border-solid' : 'border-dashed'}`} style={{ top: `${(100 / 48) * (index + 1)}%` }}></div>
                                ))}

                                {renderNote(days)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarD;