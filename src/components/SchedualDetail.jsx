import React from 'react';

const SchedualDetail = () => {
    return (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${show ? 'h-auto' : 'h-0'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                <div
                    className={`fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity ease-out duration-300 ${show ? 'h-auto' : 'h-0'}`}
                    aria-hidden="true"
                    onClick={onClose}
                />

                {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

                <div
                    className={`inline-block align-middle bg-white rounded-lg text-left overflow-y-hidden shadow-xl transform transition-all ease-out duration-300 ${show ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}`}
                    style={{ minHeight: '0', minWidth: '0', maxHeight: 'calc(100% -32px)', width: '800px' }}
                >
                    <div
                        className={`overflow-y-hidden flex-grow`}
                        style={{ maxHeight: '95vh' }}
                    >
                        <div className='bg-white rounded flex flex-col justify-between h-full'>
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
                                    className={`px-2 py-1 mr-2 rounded cursor-pointer text-${detailDate.tag_color}-600 hover:bg-${detailDate.tag_color}-100`}
                                    onClick={onSave}
                                >
                                    <Icon className='mr-2' icon={['far', 'save']} />
                                    <span><FormattedMessage id='calendar.save' /></span>
                                </div>

                                <div
                                    className={`px-2 py-1 mr-2 rounded cursor-pointer text-${detailDate.tag_color}-600 hover:bg-${detailDate.tag_color}-100 flex flex-nowrap`}
                                    onClick={onDelete}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span><FormattedMessage id='calendar.delete' /></span>
                                </div>

                                <div
                                    className={`px-2 py-1 mr-2 rounded cursor-pointer text-${detailDate.tag_color}-600 hover:bg-${detailDate.tag_color}-100 flex flex-nowrap`}
                                    onClick={() => setShowCategory(!showCategory)}
                                    ref={categoryRef}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className='px-2'>
                                        <FormattedMessage id={`calendar.category.${detailDate.tag_color}`} />
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedualDetail;