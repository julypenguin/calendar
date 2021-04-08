import React from 'react';

// import '../styl/index.styl'
import '../styl/styles.css'

const App = (props) => {

    const weeks = [
        { name: "Sunday", abb_name: "Sun" },
        { name: "Monday", abb_name: "Mon" },
        { name: "Tuesday", abb_name: "Tue" },
        { name: "Wednesday", abb_name: "Wed" },
        { name: "Thursday", abb_name: "Thu" },
        { name: "Friday", abb_name: "Fri" },
        { name: "Saturday", abb_name: "Sat" }
    ]

    const renderDate = (y, month, max, min) => {
        const { disabled } = props
        var d = typeof disabled == 'object' && disabled.indexOf('date') != -1
        var m = month - 1
        var days = (new Date(y, m + 1, 1) - new Date(y, m, 1)) / (86400 * 1000)
        var arr = []
        const maxdate = new Date(max.year, max.month - 1, max.date)
        const mindate = new Date(min.year, min.month - 1, min.date)

        if (new Date(y, m, 1).getDay() != 0) {
            var lastdays = (new Date(y, m, 1) - new Date(y, m - 1, 1)) / (86400 * 1000)
            for (var i = new Date(y, m, 1).getDay() - 1; i >= 0; i--) {
                var t = new Date(new Date(y, m - 1, 1).getFullYear(), new Date(y, m - 1, 1).getMonth(), lastdays - i)
                arr.push({ date: lastdays - i, month: new Date(y, m - 1, 1).getMonth() + 1, year: new Date(y, m - 1, 1).getFullYear(), enable: d ? false : (t - mindate) >= 0 && (maxdate - t) >= 0 })
            }
        }

        for (var i = 1; i <= days; i++) {
            var t = new Date(y, m, i)
            arr.push({ date: i, month, year: y, enable: d ? false : (t - mindate) >= 0 && (maxdate - t) >= 0 })
        }

        var i = 1
        if (new Date(y, m, days).getDay() != 6) {
            for (i; i < 7 - new Date(y, m, days).getDay(); i++) {
                var t = new Date(new Date(y, m + 1, 1).getFullYear(), new Date(y, m + 1, 1).getMonth(), i)
                arr.push({ date: i, month: new Date(y, m + 1, 1).getMonth() + 1, year: new Date(y, m + 1, 1).getFullYear(), enable: d ? false : (t - mindate) >= 0 && (maxdate - t) >= 0 })
            }
        }

        if (arr.length / 7 < 6) {
            for (i; i < i + (6 - arr.length / 7) * 7; i++) {
                var t = new Date(new Date(y, m + 1, 1).getFullYear(), new Date(y, m + 1, 1).getMonth(), i)
                arr.push({ date: i, month: new Date(y, m + 1, 1).getMonth() + 1, year: new Date(y, m + 1, 1).getFullYear(), enable: d ? false : (t - mindate) >= 0 && (maxdate - t) >= 0 })
            }
        }

        var week = []
        for (var i = 0; i < arr.length; i += 7) {
            week.push(arr.slice(i, i + 7))
        }
        return week
    }


    return (
        <div className='bg-gray-200'>
            <div className="container mx-auto mt-10">
                <div className="wrapper bg-white rounded shadow w-full ">
                    <div className="header flex justify-between border-b p-2">
                        <span className="text-lg font-bold">
                            2020 July
                    </span>
                        <div className="buttons">
                            <button className="p-1">
                                <svg width="1em" fill="gray" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-left-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path fillRule="evenodd" d="M8.354 11.354a.5.5 0 0 0 0-.708L5.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z" />
                                    <path fillRule="evenodd" d="M11.5 8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z" />
                                </svg>
                            </button>
                            <button className="p-1">
                                <svg width="1em" fill="gray" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path fillRule="evenodd" d="M7.646 11.354a.5.5 0 0 1 0-.708L10.293 8 7.646 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z" />
                                    <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <table className="w-full">
                        <thead>
                            <tr>
                                {weeks.map((week, index) => (
                                    <th key={index} className="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
                                        <span className="xl:block lg:block md:block sm:block hidden">{week.name}</span>
                                        <span className="xl:hidden lg:hidden md:hidden sm:hidden block">{week.abb_name}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>

                            {renderDate(2021, 3, { year: 1900, month: 1, date: 1 }, { year: 9999, month: 12, date: 31 }).map((week, index) => (
                                <tr key={index} className="text-center h-20">
                                    {week.map((data, i) => (
                                        <td key={i} className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300 ">
                                            <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                                <div className="top h-5 w-full">
                                                    <span className="text-gray-500">{data.date}</span>
                                                </div>
                                                <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                                                    {/* {i === 0 && <div
                                                        className="event bg-purple-400 text-white rounded p-1 text-sm mb-1"
                                                    >
                                                        <span className="event-name">Meeting</span>
                                                        <span className="time">12:00~14:00</span>
                                                    </div>} */}
                                                    <div
                                                        className="event bg-purple-400 text-white rounded p-1 text-sm mb-1"
                                                    >
                                                        <span className="event-name">Meeting 12:00~14:00</span>
                                                        {/* <span className="time">12:00~14:00</span> */}
                                                    </div>
                                                </div>

                                                {/* <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                                                <div
                                                    className="event bg-blue-400 text-white rounded p-1 text-sm mb-1"
                                                >
                                                    <span className="event-name">Shopping</span>
                                                    <span className="time">12:00~14:00</span>
                                                </div>
                                            </div> */}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* <tr className="text-center h-20">
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300 ">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">1</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                                        <div
                                            className="event bg-purple-400 text-white rounded p-1 text-sm mb-1"
                                        >
                                            <span className="event-name">
                                                Meeting
                                            </span>
                                            <span className="time">
                                                12:00~14:00
                                            </span>
                                        </div>
                                        <div
                                            className="event bg-purple-400 text-white rounded p-1 text-sm mb-1"
                                        >
                                            <span className="event-name">
                                                Meeting
                                            </span>
                                            <span className="time">
                                                18:00~20:00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">2</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">3</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">4</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">6</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-hidden transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">7</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                                        <div
                                            className="event bg-blue-400 text-white rounded p-1 text-sm mb-1"
                                        >
                                            <span className="event-name">
                                                Shopping
                                            </span>
                                            <span className="time">
                                                12:00~14:00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500 text-sm">8</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                        </tr> */}

                            {/* line 1 */}
                            {/* <tr className="text-center h-20">
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">9</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">10</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">12</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">13</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">14</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">15</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500 text-sm">16</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                        </tr> */}
                            {/* line 1 */}

                            {/* line 2 */}
                            {/* <tr className="text-center h-20">
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">16</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">17</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">18</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">19</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">20</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">21</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500 text-sm">22</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                        </tr> */}
                            {/* line 2 */}

                            {/* line 3 */}
                            {/* <tr className="text-center h-20">
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">23</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">24</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">25</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">26</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">27</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">28</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500 text-sm">29</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                        </tr> */}
                            {/* line 3 */}

                            {/* line 4 */}
                            {/* <tr className="text-center h-20">
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">30</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">31</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">1</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">2</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">3</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500">4</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                            <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                                    <div className="top h-5 w-full">
                                        <span className="text-gray-500 text-sm">5</span>
                                    </div>
                                    <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                                </div>
                            </td>
                        </tr> */}
                            {/* line 4 */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App;