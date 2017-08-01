<template>
	<div 
	v-on:mouseover="active = true"
	v-on:mouseout="active = false"
	style="display: inline-flex;" 
	>
	<slot>
		<div style="width: 300px;height: 300px;background-color: aliceblue;"><h3>Scroll over this area</h3></div>
	</slot>
</div>

</template>

<script>
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
	},
	preventDefaultForScrollKeys(e) {
		if (e.keyCode>=32&&e.keyCode<=40) {
			this.$emit('scrolld',this.keys[e.keyCode] || '')
			this.preventDefault(e);		
			return false;
		}
	}
},
created () {
	document.addEventListener(
		'wheel',
		function(e){
			if (this.active) {
				var delta = e.deltaY;
				if (delta > 0){
					this.$emit('scrolld','down')
				}else{
					this.$emit('scrolld','up')
				}
				return this.active;
			}		
		}.bind(this),true);

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
