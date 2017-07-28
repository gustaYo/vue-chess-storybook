
var time = 60*1*1000
var timeLoop = 1
var start = () => {
		clearInterval(timeLoop)
		timeLoop = setInterval(() =>{
			time = time - 10
			if (time > 0) {
				var s = time/1000
				var seg = s % 60
				if (parseInt(seg) === seg) {
					//console.log(parseInt(seg))
					postMessage(time);
				};			
			}else{
				clearInterval(timeLoop)
				time = 0
				postMessage(JSON.stringify(time));
			}
	},10)
}

var methods = {
	start: () => {
		start()
},
	stop: () => {
		clearInterval(timeLoop)
},
	setTime: (newTime) => {
		console.log('setTime',newTime)
		time = newTime
}
}
self.onmessage = (e) => {
	var data = JSON.parse(e.data)
	var fnc = data.fun
	var arg = data.arg || {}
	methods[fnc].call(this,arg)
}