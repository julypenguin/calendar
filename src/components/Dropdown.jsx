import React from 'react';
import { createPortal } from 'react-dom'

const DropDown = ({
    parentRef,
    handleClose,
    children,
    className,
    style,
}) => {

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
    
    return (
        <>
            {createPortal(
                <div className={`fixed h-full w-full top-0 z-10`}>
                    <div
                        className='fixed h-full w-full top-0 left-0'
                        onClick={handleClose}
                    ></div>
                    <div
                        className={`absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-10 transition ease-out duration-75 flex`}
                        style={detectPosition(parentRef)}
                    >
                        <div className='flex flex-col select-none'>
                            <ul
                                className={`flex flex-col overflow-x-hidden overscroll-y-auto ${className}`}
                                style={style}
                            >
                                {children}
                            </ul>
                        </div>
                        <div className='top-0 border-r'></div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default DropDown;