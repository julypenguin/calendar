import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl';
import { createPortal } from 'react-dom'
import { getFullDate, parseToDateString, parseToISOString } from 'lib/datetime'
import { colorMap } from './formatDate'
import EditorNote from './EditorNote'
import Modal from './Modal'

const SchedualDetail = ({
    match,
    history,
    calendarData, // 整個行程陣列資料
    setCalendarData, // 將資料傳出去
    detailDate,
    setDetailDate,
    handleClose,
    getAvatar,
    ...otherProps
}) => {

    const [showEditor, setShowEditor] = useState(false)

    const tag_color = colorMap[detailDate.tag_color]
    const evt_sid = parseInt(match.params.sid) || 0

    const onClose = () => {
        if (typeof handleClose === 'function') handleClose()
        setShowEditor(false)
    }

    const fetchDeleteCalendar = (data) => {
        console.log('data', data)
        const options = {
            headers: {
                'Accept': '*',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
        }

        fetch(`https://support6-dev.iqs-t.com/teamweb/api/teamweb/calendar/${data.evt_sid}`, {
            ...options,
            method: 'DELETE',
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log('post_result', res)
        })
    }

    const onDelete = () => {
        const newCalendarData = calendarData.filter((data, index) => data.sid !== detailDate.sid)
        setCalendarData(newCalendarData)
        fetchDeleteCalendar(detailDate)
        onClose()
    }

    const onEdit = () => {
        setShowEditor(true)
    }

    useEffect(() => {
        if (evt_sid) {
            const options = {
                headers: {
                    'Accept': '*',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                mode: 'cors',
            }

            fetch(`https://support6-dev.iqs-t.com/teamweb/api/teamweb/calendar/${evt_sid}`, {
                ...options,
            }).then(res => {
                return res.json()
            }).then(res => {
                const schedual = res.data
                const qs = new URLSearchParams(history.location && history.location.search)
                const qs_obj = {}
                qs.forEach((val, name) => {
                    qs_obj[name] = val
                })

                if (!schedual) return
                setDetailDate({
                    ...detailDate,
                    ...res.data,
                    sid: schedual.evt_sid || 0,
                    title: schedual.title || '',
                    btime: qs_obj.b || new Date(),
                    etime: qs_obj.e || new Date(),
                    start_time: schedual.start_time || new Date(),
                    end_time: schedual.end_time || new Date(),
                    final_date: schedual.final_date || new Date(),
                    desc: schedual.detail || '',
                    tag_color: schedual.color || '',
                    all_day: schedual.is_allday || false,
                    location: schedual.location || "",
                })
            })
        }
    }, [evt_sid])

    return (
        <>
            {/* 頁首 */}
            <div className={`bg-${tag_color}-500-g pl-2 pr-1 flex justify-end`}>
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
            <div className={`bg-${tag_color}-50 pl-8 pr-1 py-1 flex select-none`}>
                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color} bg-${tag_color}-100-g-hover`}
                    onClick={onEdit}
                >
                    <Icon className='mr-2' icon={['far', 'save']} />
                    <span><FormattedMessage id='calendar.detail.edit' /></span>
                </div>

                <div
                    className={`px-2 py-1 mr-2 rounded cursor-pointer flex-shrink-0 text-${tag_color} bg-${tag_color}-100-g-hover flex flex-nowrap`}
                    onClick={onDelete}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span><FormattedMessage id='calendar.detail.delete' /></span>
                </div>

            </div>

            {/* 內容 */}
            <div className='flex min-h-0 flex-auto flex-col'>
                <div className='p-2 pr-4 pt-8'>
                    {/* 標題 */}
                    <div
                        className='flex'
                        style={{ minHeight: '32px' }}
                    >
                        <div
                            className='mr-2'
                            style={{ width: '32px', height: '32px' }}
                        >

                        </div>
                        <div className='flex-grow flex'>
                            <div
                                className={`text-${tag_color} mr-2 pb-1 pl-2 flex-grow text-2xl font-semibold`}
                            >
                                {detailDate.title}
                            </div>
                        </div>
                    </div>

                    {/* 時間 */}
                    <div className='flex'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className='mt-2 flex flex-1'>
                                {detailDate.all_day ?
                                    <div className='flex-1 px-2'>
                                        <div className='flex mb-4 flex-wrap'>
                                            <FormattedDate value={detailDate.btime} />
                                            <span className='mx-2'>~</span>
                                            <FormattedDate value={detailDate.etime} />
                                        </div>
                                    </div>
                                    :
                                    <div className='flex-1 px-2'>
                                        <div className='flex mb-4 flex-wrap'>
                                            <FormattedDate value={detailDate.btime} />
                                            <FormattedTime value={detailDate.btime} />
                                            <span className='mx-2'>~</span>
                                            <FormattedDate value={detailDate.etime} />
                                            <FormattedTime value={detailDate.etime} />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div></div>
                    </div>

                    {/* 出席者 */}
                    <div className='flex'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div
                                className='w-full p-2'
                            >
                                {detailDate.attend && detailDate.attend.map(aa => (
                                    <div 
                                        key={aa.aa_sid}
                                        className='flex items-center mb-1'
                                    >
                                        <div
                                            className='relative mr-2'
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            <div className='absolute inset-0 rounded-full bg-white'>
                                                {typeof getAvatar !== 'function' ? null :
                                                    <img
                                                        className='w-full h-full rounded-full border border-gray-300'
                                                        src={getAvatar(aa.aa_sid)} 
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <div>{aa.aa_name || aa.aa_id}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 地點 */}
                    <div className='flex'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div
                                className='w-full p-2'
                            >
                                {detailDate.location}
                            </div>
                        </div>
                    </div>

                    {/* 備註 */}
                    <div className='flex'>
                        <div className='w-full flex'>
                            <div className='p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </div>
                            <div
                                className='w-full p-2'
                            >
                                <span dangerouslySetInnerHTML={{ __html: detailDate.desc }}></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-2 pr-4'></div>
            </div>

            {!showEditor ? null : createPortal(
                <Modal
                    {...otherProps}
                    Content={EditorNote}
                    show={showEditor}
                    handleClose={onClose}
                    defaultValue={detailDate}
                    setDefaultValue={setDetailDate}
                    calendarData={calendarData}
                    setCalendarData={setCalendarData}
                    evt_sid={evt_sid}
                />,
                document.body
            )}
        </>
    );
};

export default SchedualDetail;