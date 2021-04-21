import React from 'react';

const EditorNote = () => {
    return (
        //  This example requires Tailwind CSS v2.0+ 
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                {/* Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
     */}
                <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

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
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-y-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full"
                    style={{ minHeight: '0', minWidth: '0', maxHeight: 'calc(100% -32px)', maxWidth: 'calc(100% - 32px)' }}
                >
                    <div
                        className='overflow-y-hidden flex-grow'
                        style={{ maxHeight: '95vh' }}
                    >
                        <div className='bg-white rounded flex flex-col justify-between h-full'>
                            {/* header */}
                            <div className='bg-blue-500 pl-2 pr-1 flex justify-end'>
                                <div className='p-2 text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                            </div>
                            {/* content */}
                            <div className='flex min-h-0 flex-auto flex-col'>
                                <div className='p-2 pr-4 pt-3'>
                                    {/* 新增標題 */}
                                    <div
                                        className='mb-2 flex'
                                        style={{ minHeight: '32px' }}
                                    >
                                        <div
                                            className='mr-2'
                                            style={{ width: '32px', height: '32px' }}
                                        >

                                        </div>
                                        <div className='flex-grow flex'>
                                            <input
                                                className='text-blue-600 mr-2 pb-1 pl-2 flex-grow text-lg font-semibold border-b border-gray-300 focus-visible:ring-2 focus-visible:ring-rose-500'
                                                placeholder='新增標題'
                                            />
                                        </div>
                                    </div>

                                    {/* 選擇時間 */}
                                    <div className='flex '>
                                        <div className='w-full flex'>
                                            <div className='p-2'>icon</div>
                                            <div className='mt-2'>
                                                <div className='flex'>
                                                    <div className='flex-1' style={{ minWidth: '140px' }}>
                                                        <input className='pl-2 pr-5' />
                                                        icon
                                                    </div>
                                                    <div className='pl-2 mb-4 flex justify-between' style={{ minWidth: '96px' }}>
                                                        <div className='pr-4'></div>
                                                    </div>
                                                </div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className='p-2 pr-4'></div>
                            </div>
                        </div>
                        {/* <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Payment successful
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
                                </p>
                            </div>
                        </div> */}
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                            Go back to dashboard
        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorNote;