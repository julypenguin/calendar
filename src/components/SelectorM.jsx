import React, { useState, useEffect } from 'react';
import { getFullDate } from 'lib/datetime'

const SelectorM = ({
    month,
    defaultData,
    renderFullDate,
}) => {
    const [previewData, setPreviewData] = useState(new Date())

    const months = [
        { name: '1 月' },
        { name: '2 月' },
        { name: '3 月' },
        { name: '4 月' },
        { name: '5 月' },
        { name: '6 月' },
        { name: '7 月' },
        { name: '8 月' },
        { name: '9 月' },
        { name: '10 月' },
        { name: '11 月' },
        { name: '12 月' },
    ]

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
                    <div className='flex-1 pl-2 pr-5 hover:bg-gray-100 cursor-pointer'>{renderFullDate({ data: previewData, noMonth: true, noDate: true })}</div>
                    <div className='flex'>
                        <div 
                            className='flex justify-center items-center cursor-pointer hover:bg-gray-100' style={{ width: '28px', height: '28px' }}
                            onClick={() => setYear(setPreviewData, previewData, -1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <div 
                            className='flex justify-center items-center cursor-pointer hover:bg-gray-100' 
                            style={{ width: '28px', height: '28px' }}
                            onClick={() => setYear(setPreviewData, previewData, 1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mt-1' role='grid'>
                        <div className='mb-2' role='row'>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>1 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>2 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>3 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer bg-blue-200' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>4 月</div>
                        </div>
                        <div className='mb-2' role='row'>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>5 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>6 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>7 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>8 月</div>
                        </div>
                        <div className='mb-1' role='row'>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>9 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>10 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>11 月</div>
                            <div className='mr-1 text-xs text-center inline-block cursor-pointer hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>12 月</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-right px-6 text-xs hover:text-blue-400 cursor-pointer'>今天</div>
        </div>
    );
};

export default SelectorM;