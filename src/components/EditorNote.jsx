import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { FormattedMessage } from 'react-intl';
import { createPortal } from 'react-dom'

const EditorNote = ({
    show,
    handleClose,
}) => {

    const [btime, etime] = useState('')
    const [category, setCategory] = useState('blue')
    const [showCategory, setShowCategory] = useState(false)

    const categoryRef = useRef()

    const categoryList = [
        {
            name: 'red',
            color: 'red',
        },
        {
            name: 'pink',
            color: 'pink',
        },
        {
            name: 'yellow',
            color: 'yellow',
        },
        {
            name: 'green',
            color: 'green',
        },
        {
            name: 'blue',
            color: 'blue',
        },
        {
            name: 'indigo',
            color: 'indigo',
        },
        {
            name: 'purple',
            color: 'purple',
        },
        {
            name: 'gray',
            color: 'gray',
        },
    ]

    const onClose = () => {
        console.log('2222', handleClose)
        if (typeof handleClose === 'function') handleClose()
    }

    const detectPosition = (ref, rightAndBottom) => {
        if (!ref) return {}
        const elementRef = ref.current
        const ele = elementRef.getBoundingClientRect()

        if (rightAndBottom && parentEle) {
            return { top: ele.bottom, right: parentEle.right - ele.right, zIndex: 6666666 }
        }
        if (window.innerHeight - ele.top > 310) return { top: ele.bottom + 2, left: ele.left, zIndex: 6666666 }
        else return { top: ele.top + ele.height, right: ele.left, zIndex: 6666666, width: '219px', height: '215.7px' }
    }

    const renderCategoryList = (data, index) => {
        if (!data) return null
        return (
            <li 
                key={index} 
                className={`flex flex-nowrap items-center pl-2 py-2 pr-8 hover:bg-gray-100 cursor-pointer`}
                onClick={() => setCategory(data.color && data.color.toLowerCase())}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-${data.color}-500`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>
                    <FormattedMessage id={`calendar.category.${data.color}`} />
                </span>
            </li>
        )
    }

    return (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${show ? 'h-auto' : 'h-0'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                {/* Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
     */}
                <div 
                    className={`fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity ${show ? 'h-auto' : 'h-0'}`}
                    aria-hidden="true"
                    onClick={onClose}
                />

                {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

                {/* <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
                <div
                    className={`inline-block align-middle bg-white rounded-lg text-left overflow-y-hidden shadow-xl transform transition-all ease-out duration-300 ${show ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}`}
                    style={{ minHeight: '0', minWidth: '0', maxHeight: 'calc(100% -32px)', width: '800px' }}
                >
                    <div
                        className='overflow-y-hidden flex-grow'
                        style={{ maxHeight: '95vh' }}
                    >
                        <div className='bg-white rounded flex flex-col justify-between h-full'>
                            {/* 頁首 */}
                            <div className={`bg-${category}-500 pl-2 pr-1 flex justify-end`}>
                                <div className='p-2 text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>

                            {/* 功能按鈕 */}
                            <div className={`bg-${category}-50 pl-8 pr-1 py-1 flex`}>
                                <div className={`px-2 py-1 mr-2 rounded cursor-pointer text-${category}-600 hover:bg-${category}-100`}>
                                    <Icon className='mr-2' icon={['far', 'save']} />
                                    <span>儲存</span>
                                </div>

                                <div className={`px-2 py-1 mr-2 rounded cursor-pointer text-${category}-600 hover:bg-${category}-100 flex flex-nowrap`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>捨棄</span>
                                </div>

                                <div
                                    className={`px-2 py-1 mr-2 rounded cursor-pointer text-${category}-600 hover:bg-${category}-100 flex flex-nowrap`}
                                    onClick={() => setShowCategory(!showCategory)}
                                    ref={categoryRef}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className='px-2'>
                                        <FormattedMessage id={`calendar.category.${category}`} />
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>

                                    {!showCategory ? null : createPortal(
                                        <div className={`fixed h-full w-full top-0 z-10`}>
                                            <div className='fixed h-full w-full top-0 left-0' onClick={() => setShowCategory(false)}></div>
                                            <div
                                                className={`absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-10 transition ease-out duration-75 flex`}
                                                style={detectPosition(categoryRef)}
                                            >
                                                <div className='flex flex-col select-none'>
                                                    <ul className='flex flex-col'>
                                                        {categoryList.map((data, index) => renderCategoryList(data, index))}
                                                    </ul>
                                                </div>
                                                <div className='top-0 border-r'></div>
                                            </div>
                                        </div>,
                                        document.body
                                    )}
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
                                        <div
                                            className='mr-2'
                                            style={{ width: '32px', height: '32px' }}
                                        >

                                        </div>
                                        <div className='flex-grow flex'>
                                            <input
                                                className={`text-${category}-600 mr-2 pb-1 pl-2 flex-grow text-2xl font-semibold border-b border-gray-300 focus:outline-none`}
                                                placeholder='新增標題'
                                            />
                                        </div>
                                    </div>

                                    {/* 選擇時間 */}
                                    <div className='flex mb-4'>
                                        <div className='w-full flex'>
                                            <div className='p-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className='mt-2 flex-1'>
                                                <div className='flex mb-4'>
                                                    <div className='relative flex flex-1' style={{ minWidth: '140px' }}>
                                                        <input
                                                            className='pl-2 outline-none text-lg border-b border-gray-300 truncate flex-1 text-gray-600'
                                                            placeholder=''
                                                            type='date'
                                                            defaultValue={new Date()}
                                                        />
                                                    </div>
                                                    <div className='pl-3 flex justify-between' style={{ minWidth: '96px' }}>
                                                        <div className='flex border-b border-gray-300 pl-2'>
                                                            <input
                                                                className='outline-none text-gray-600'
                                                                style={{}}
                                                                defaultValue={'下午 01:00'}
                                                            />
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex'>
                                                    <div className='relative flex flex-1' style={{ minWidth: '140px' }}>
                                                        <input
                                                            className='pl-2 outline-none text-lg border-b border-gray-300 truncate flex-1 text-gray-600'
                                                            placeholder=''
                                                            type='date'
                                                            defaultValue={new Date()}
                                                        />
                                                    </div>
                                                    <div className='pl-3 flex justify-between' style={{ minWidth: '96px' }}>
                                                        <div className='flex border-b border-gray-300 pl-2'>
                                                            <input
                                                                className='outline-none text-gray-600'
                                                                style={{}}
                                                                defaultValue={'下午 01:00'}
                                                            />
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div></div>
                                    </div>

                                    {/* 備註 */}
                                    <div className='flex mb-4'>
                                        <div className='w-full flex'>
                                            <div className='p-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                                </svg>
                                            </div>
                                            <textarea
                                                className='border border-gray-300 w-full h-32'
                                                style={{ padding: '8px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='p-2 pr-4'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorNote;