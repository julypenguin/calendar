import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl';
import { createPortal } from 'react-dom'
import { getFullDate, parseToDateString, parseToISOString } from 'lib/datetime'
import { Datetimepicker } from '@iqs/datetimepicker'
import '@iqs/datetimepicker/index.styl'

const Modal = ({
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
            start_time: defaultValue.btime,
            end_time: defaultValue.etime,
            desc: "",
            tag_color: "#BFDBFE",
        })
    }

    useEffect(() => {
        let tag_color = '#BFDBFE'
        if (defaultValue && defaultValue.start_time) {
            if (defaultValue.tag_color) tag_color = defaultValue.tag_color
            setDetailDate({ ...defaultValue, tag_color })
        }
    }, [defaultValue])

    return (
            <div className={`fixed z-10 ${!show ? '' : 'inset-0'} overflow-y-auto ${show ? 'h-auto' : 'h-0'}`} role="dialog">
                <div className={`${!show ? '' : 'flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center p-0-sm'}`}>

                    <div
                        className={`fixed ${!show ? '' : 'inset-0'} bg-gray-400-o75 transition-opacity-g ease-out-g duration-300-g ${show ? 'h-auto' : 'h-0'}`}
                        aria-hidden="true"
                        onClick={onClose}
                    />

                    <div
                        className={`inline-block align-middle bg-white rounded-lg text-left overflow-y-hidden shadow-xl transform-g transition-all ease-out-g duration-300-g translate-y-0 ${show ? 'opacity-100  scale-100-sm' : 'opacity-0 translate-y-4 scale-95-sm'}`}
                        style={{ minHeight: '0', minWidth: '0', maxHeight: 'calc(100% -32px)', width: '800px', zIndex: '1' }}
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

export default Modal;