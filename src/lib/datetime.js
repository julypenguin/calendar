export function addDays(days=0, date=new Date()){
    const dat = new Date(date); 
    dat.setDate(dat.getDate() + days);  
    return dat
}

export function addYears(year=0) {
	const date = new Date()
	date.setFullYear(date.getFullYear() + year)
	return date
}

export function getFullDate(datetime) {

	let date = datetime? new Date(datetime) : new Date()

	return {
		y: date.getFullYear(),
		m: leftpad(date.getMonth()+1),
		d: leftpad(date.getDate()),
		h: leftpad(date.getHours()),
		mm: leftpad(date.getMinutes()),
		s: leftpad(date.getSeconds()),
		date,
	}
}

export function parseToDateString(datetime) {
	let {y,m,d} = getFullDate(datetime)
	return `${y}-${m}-${d}`
}


export function parseToDateTimeString(datetime) {
	let {y,m,d,h,mm,s} = getFullDate(datetime)
	return `${y}-${m}-${d}T${h}:${mm}:${s}`
}


export function parseToISOString(datetime){
	let {y,m,d,h,mm,s} = getFullDate(datetime)
	return `${y}-${m}-${d}T${h}:${mm}`
}

function leftpad(str,len=2,pattern='0') {
	str += ''
	if(str.length<len)
		for (let i = 0; i < len-str.length; i++) 
			str = '0'+str
	return str
}

export function getCycleDays({ date, dayCount, isWeek }) {
	if (!new Date(date).getDate()) return []
	const dayArr = []

	if (isWeek) {
		const prevDaysCount = new Date(date).getDay()
		let j = 1

		for (let i = 0; i <= prevDaysCount; i++) {
			const newDate = addDays(i - prevDaysCount, date)
			setStartTime(newDate)

			dayArr.push(newDate)
		}

		for (j = 1; j <= 6 - prevDaysCount + 1; j++) {
			const newDate = addDays(j, date)
			setStartTime(newDate)

			dayArr.push(newDate)                
		}

	} else {
		let i = 0
		for (i = 0; i < dayCount; i++) {
			const newDate = addDays(i, date)
			setStartTime(newDate)

			dayArr.push(newDate)
		}
	}

	return dayArr
}

function setStartTime(date) {
	date.setHours(0)
	date.setMinutes(0)
	date.setSeconds(0)
}
