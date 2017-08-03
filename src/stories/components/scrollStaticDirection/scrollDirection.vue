<template>
	<div 
	v-on:mouseover="active = true"
	v-on:mouseout="active = false"
	style="display: inline-flex;" 
	ref="containerScroll"
	>
	<slot>
		<div style="width: 300px;height: 300px;background-color: aliceblue;"><h3>Scroll over this area</h3> {{active}}</div>
	</slot>
</div>

</template>

<script>

	function isEventSupported(eventName) {
		var el = document.createElement('div');
		eventName = 'on' + eventName;
		var isSupported = (eventName in el);
		if (!isSupported) {
			el.setAttribute(eventName, 'return;');
			isSupported = typeof el[eventName] == 'function';
		}
		el = null;
		return isSupported;
	}

	export default {
		data () {
			return {
				scrolled: false,
				active: false,
				// left: 37, up: 38, right: 39, down: 40,
				// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
				keys: {37: 'down', 38: 'up', 39: 'up', 40: 'down', 32: 'up', 33: 'up', 34: 'down', 35: 'end', 36: 'home'},
			};
		},
		methods: {
			preventDefault(e) {
				e = e || window.event;
				if (e.preventDefault)
					e.preventDefault();
				e.returnValue = false;  
			},
			enableScroll() {
				var wheelEvent = isEventSupported('mousewheel') ? 'mousewheel' : 'wheel';
				document.addEventListener(wheelEvent,this.onScroll);
				if (window.removeEventListener)
					window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
				window.onmousewheel = document.onmousewheel = null; 
				window.onwheel = null; 
				window.ontouchmove = null;  
				document.onkeydown = null;  
			},
			disableScroll() {		
		if (window.addEventListener) // older FF
			window.addEventListener('DOMMouseScroll', this.preventDefault, false);
		window.onwheel = this.preventDefault; // modern standard
		window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
		window.ontouchmove  = this.preventDefault; // mobile
		document.onkeydown  = this.preventDefaultForScrollKeys;
		//document.removeEventListener("wheel", this.onScroll); 
	},
	preventDefaultForScrollKeys(e) {
		if (e.keyCode>=32&&e.keyCode<=40) {
			this.$emit('scrolld',this.keys[e.keyCode] || '')
			this.preventDefault(e);		
			return false;
		}
	},
	onScroll(e){
		if (this.active) {
			var delta = e.deltaY;
			if (delta > 0){
				this.$emit('scrolld','down')
			}else{
				this.$emit('scrolld','up')
			}
			return this.active;
		}
	}
},
created () {
},
watch: {
	active (val, oldVal) {
		if (!val) {
			this.enableScroll()
		}else{
			this.disableScroll()
		}
	}
}
}
</script>
