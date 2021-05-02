import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl';
import { createPortal } from 'react-dom'
import { getFullDate, parseToDateString, parseToISOString } from 'lib/datetime'
import { Datetimepicker } from '@iqs/datetimepicker'
import '@iqs/datetimepicker/index.styl'

const EditorNote = ({
    calendarData, // 整個行程陣列資料
    setCalendarData, // 將資料傳出去
    detailDate,
    setDetailDate,
    onClose,
}) => {

    // const [detailDate, setDetailDate] = useState({ tag_color: 'blue' })

    // const onClose = () => {
    //     if (typeof handleClose === 'function') handleClose()
    //     setDefaultValue({
    //         sid: String(Date.now()),
    //         title: "",
    //         btime: defaultValue.btime,
    //         etime: defaultValue.etime,
    //         desc: "",
    //         tag_color: "blue",
    //     })
    // }

    const onDelete = () => {
        const newCalendarData = calendarData.filter((data, index) => data.sid !== detailDate.sid)
        setCalendarData(newCalendarData)
        onClose()
    }

    const onSave = () => {
        if ((new Date(detailDate.etime) - new Date(detailDate.btime)) < 0) {
            detailDate.etime = detailDate.btime
        }

        const addLength = calendarData.filter((data, index) => data.sid === detailDate.sid).length
        const newCalendarData = calendarData.map((data, index) => {
            if (data.sid === detailDate.sid) return detailDate
            return data
        })
        if (!addLength) newCalendarData.push(detailDate)
        setCalendarData(newCalendarData)
        onClose()
    }

    // const detectPosition = (ref, rightAndBottom) => {
    //     if (!ref) return {}
    //     const elementRef = ref.current
    //     const ele = elementRef.getBoundingClientRect()

    //     if (rightAndBottom && parentEle) {
    //         return { top: ele.bottom, right: parentEle.right - ele.right, zIndex: 6666666 }
    //     }
    //     if (window.innerHeight - ele.top > 310) return { top: ele.bottom + 2, left: ele.left, zIndex: 6666666 }
    //     else return { top: ele.top + ele.height, right: ele.left, zIndex: 6666666, width: '219px', height: '215.7px' }
    // }

    // const renderCategoryList = (data, index) => {
    //     if (!data) return null
    //     return (
    //         <li
    //             key={index}
    //             className={`flex flex-nowrap items-center pl-2 py-2 pr-8 hover:bg-gray-100 cursor-pointer`}
    //             onClick={() => setDetailDate({ ...detailDate, tag_color: data.color.toLowerCase() })}
    //         >
    //             <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-${data.color}-500`} viewBox="0 0 20 20" fill="currentColor">
    //                 <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    //             </svg>
    //             <span>
    //                 <FormattedMessage id={`calendar.category.${data.color}`} />
    //             </span>
    //         </li>
    //     )
    // }

    // useEffect(() => {
    //     let tag_color = 'blue'
    //     if (defaultValue.tag_color) tag_color = defaultValue.tag_color
    //     setDetailDate({ ...defaultValue, tag_color })
    // }, [defaultValue])

    return (
        <>
            {/* 頁首 */}
            <div className={`bg-${detailDate.tag_color}-500 pl-2 pr-1 flex justify-end`}>
                <div
                    className='p-2 text-white cursor-pointer'
                    onClick={onClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            {/* 功能按鈕 */}
            <div className={`bg-${detailDate.tag_color}-50 pl-8 pr-1 py-1 flex select-none`}>
                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${detailDate.tag_color}-600 hover:bg-${detailDate.tag_color}-100`}
                    onClick={onSave}
                >
                    <Icon className='mr-2' icon={['far', 'save']} />
                    <span><FormattedMessage id='calendar.save' /></span>
                </div>

                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${detailDate.tag_color}-600 hover:bg-${detailDate.tag_color}-100 flex flex-nowrap`}
                    onClick={onDelete}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span><FormattedMessage id='calendar.delete' /></span>
                </div>

            </div>

            {/* 內容 */}
            <div className='flex min-h-0 flex-auto flex-col'>
                <div className='p-2 pr-4 pt-8'>
                    {/* 新增標題 */}
                    <div
                        className='mb-4 flex'
                        style={{ minHeight: '32px' }}
                    >

                    </div>

                    {/* 選擇時間 */}
                    <div className='flex mb-4'>

                    </div>

                    {/* 備註 */}
                    <div className='flex mb-4'>

                    </div>
                </div>
                <div className='p-2 pr-4'></div>
            </div>
        </>
    );
};

export default EditorNote;