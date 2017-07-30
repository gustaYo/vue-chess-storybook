
var times = {
	w: 60*1*1000,
	b: 60*1*1000
}
var timeLoop = {
	b: 2,
	w: 1,
}
var colorActive = 'w'

const sendMensaje = (men) => {
	postMessage(JSON.stringify(men))
}
clearInterval(timeLoop['b'])
clearInterval(timeLoop['w'])
const start = () => {
	clearInterval(timeLoop[colorActive])
	timeLoop[colorActive] = setInterval(() =>{			
		times[colorActive] = times[colorActive] - 10
		if (times[colorActive] > 0) {
			const s = times[colorActive]/1000
			const seg = s % 60
			if (parseInt(seg) === seg) {
				sendMensaje({time: times[colorActive], c: colorActive});
			}
		}else{
			clearInterval(timeLoop[colorActive])
			times[colorActive] = 0
			sendMensaje({time: times[colorActive], c: colorActive});
		}
	},10)

}

const methods = {
	start: (color) => {	
		clearInterval(timeLoop[colorActive])	
		setTimeout(()=>{
			colorActive = color || colorActive
			clearInterval(timeLoop[colorActive])
			start()	
		},2)
	},
	stop: (color) => {
		clearInterval(timeLoop[colorActive])
		clearInterval(timeLoop[color])
	},
	toogleColor: () => {
		clearInterval(timeLoop[colorActive])
		colorActive = colorActive === 'w' ? 'b' : 'w'
		start()
	},
	setTime: (newTime) => {
		Object.assign(times,newTime)
	}
}
self.onmessage = (e) => {
	const data = JSON.parse(e.data)
	const fnc = data.fun
	const arg = data.arg || {}
	methods[fnc].call(this,arg)
}