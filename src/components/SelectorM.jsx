import React from 'react';

const SelectorM = () => {
    return (
        <div className='flex flex-col select-none'>
            <div className='px-2 pt-2 pb-1 overflow-hidden' style={{ width: '196px' }}>
                <div className='flex'>
                    <div className='flex-1 pl-2 pr-5 hover:bg-gray-100 cursor-pointer'>2021</div>
                    <div className='flex items-center'>
                        <div className='text-center' style={{ width: '28px', height: '28px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <div className='text-center' style={{ width: '28px', height: '28px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mt-1' role='grid'>
                        <div className='mb-2' role='row'>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>1 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>2 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>3 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>4 月</div>
                        </div>
                        <div className='mb-2' role='row'>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>5 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>6 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>7 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>8 月</div>
                        </div>
                        <div className='' role='row'>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>9 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>10 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>11 月</div>
                            <div className='mr-1 text-xs text-center inline-block hover:bg-gray-100' role='gridcell' style={{ width: '40px', height: '40px', lineHeight: '40px' }}>12 月</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-right px-5 text-xs'>今天</div>
        </div>
    );
};

export default SelectorM;