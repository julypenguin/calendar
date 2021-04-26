import React from 'react';

const Schedule = () => {
    return (
        <div className='border-l flex flex-col'>
            <div 
                className='flex flex-col h-full' 
                style={{ width: '320px', minWidth: '320px', maxHeight: 'calc(100vh - 92px)' }}
            >
                <div className='flex flex-auto h-full overflow-y-auto overflow-x-hidden'>
                    <div className='overflow-hidden flex flex-col w-full'>
                        <div 
                            className='pl-3 border-b flex-row flex-nowrap justify-between overflow-hidden' 
                            style={{ height: '48px', minHeight: '48px' }}
                        ></div>
                        <div 
                            className='overflow-x-hidden overscroll-y-auto'
                            style={{ height: 'calc(100% - 84px)' }}
                        >
                            <div className='flex min-h-0 flex-auto h-full'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;