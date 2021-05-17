import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl';
import { createPortal } from 'react-dom'
import { getFullDate, parseToDateString, parseToISOString } from 'lib/datetime'
import { Datetimepicker } from '@iqs/datetimepicker'
import '@iqs/datetimepicker/index.styl'

const EditorNote = ({
    show,
    handleClose,
    defaultValue, // detail 的資料
    setDefaultValue, // 重置 default
    Content,
    ...otherProps
}) => {

    const [detailDate, setDetailDate] = useState({ title: '', tag_color: '#BFDBFE' })

    const onClose = () => {
        if (typeof handleClose === 'function') handleClose()
        if (!defaultValue) return
        setDefaultValue({
            sid: String(Date.now()),
            title: "",
            btime: defaultValue.btime,
            etime: defaultValue.etime,
            desc: "",
            tag_color: "#BFDBFE",
        })
    }

    useEffect(() => {
        let tag_color = '#BFDBFE'
        if (defaultValue && defaultValue.btime) {
            if (defaultValue.tag_color) tag_color = defaultValue.tag_color
            setDetailDate({ ...defaultValue, tag_color })
        }
    }, [defaultValue])

    return (
            <div className={`fixed z-10 inset-0 overflow-y-auto ${show ? 'h-auto' : 'h-0'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">

                    <div
                        className={`fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity ease-out duration-300 ${show ? 'h-auto' : 'h-0'}`}
                        aria-hidden="true"
                        onClick={onClose}
                    />

                    <div
                        className={`inline-block align-middle bg-white rounded-lg text-left overflow-y-hidden shadow-xl transform transition-all ease-out duration-300 ${show ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}`}
                        style={{ minHeight: '0', minWidth: '0', maxHeight: 'calc(100% -32px)', width: '800px' }}
                    >
                        <div
                            className={`overflow-y-hidden flex-grow`}
                            style={{ maxHeight: '95vh' }}
                        >
                            <div className='bg-white rounded flex flex-col justify-between h-full'>
                                {show && <Content
                                    {...otherProps}
                                    handleClose={onClose}
                                    detailDate={detailDate}
                                    setDetailDate={setDetailDate}
                                />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    );
};

export default EditorNote;