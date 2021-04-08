import React from 'react';

const SelectorM = () => {
    return (
        <div className='flex flex-col'>
            <div className='pd-2 overflow-hidden' style={{ width: '196px' }}>
                <div className='flex'>
                    <div>2021</div>
                    <div className='flex items-center'>
                        <div>↑</div>
                        <div>↓</div>
                    </div>
                </div>
                <div>
                    <div role='grid'>
                        <div role='row'>
                            <span role='gridcell'>一月</span>
                            <span role='gridcell'>二月</span>
                            <span role='gridcell'>三月</span>
                        </div>
                        <div role='row'>
                            <span role='gridcell'>一月</span>
                            <span role='gridcell'>二月</span>
                            <span role='gridcell'>三月</span>
                        </div>
                        <div role='row'>
                            <span role='gridcell'>一月</span>
                            <span role='gridcell'>二月</span>
                            <span role='gridcell'>三月</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectorM;