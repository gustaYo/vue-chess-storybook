<template>
  <span v-bind:class="[className]">
  	{{ $store.state.board[keyname].times[color] | boardTime}}
  </span>
</template>

<script>
import timerCountDown from 'worker-loader!./timeWorker.js';
  export default {
    props: {

      time: {
        type: Number,
        default: 70*1000
      },
      active: {
        type: Boolean,
        default: false
      },
      keyname: {
        default: 'vue-chess'
      },
      color: {
        default: 'b'
      },
      className: {
        default: 'flat-text-board-timer'
      }
    },
    data () {
      return {
        timerWorker: new timerCountDown()
      }
    },
    methods: {
      changeTime (time) {
        this.setTime(time)
        this.$store.commit('changeTime',{keyName: this.keyname,c: this.color, time: time})
      },
      start_() {
        this.timerWorker.postMessage(JSON.stringify({fun: 'start'}));
      },
      stop_() {
        this.timerWorker.postMessage(JSON.stringify({fun: 'stop'}));
      },
      setTime (time) {
        var men = {
          fun: 'setTime',
          arg: time
        }
        this.timerWorker.postMessage(JSON.stringify(men));         
      },
      initTime () {
        this.$store.commit('initTime',{keyName: this.keyname,c: this.color, time: this.time})
        this.timerWorker.addEventListener(
          'message',
          (e) => {
            this.$store.commit('changeTime',{keyName: this.keyname,c: this.color, time: e.data})
          }
        )
        this.setTime(this.time)
      }
    },  
    created () {
      this.initTime()
      if (this.active){
        this.start_() 
      }
    },
    filters: {
      boardTime (s) {
        var s = s/1000
        var min = parseInt(s / 60)
        var segs = parseInt(s % 60)
        return ('0' + min).slice(-2) + ':' + ('0' + segs).slice(-2)        
      }
    },
    beforeDestroy () {
      this.timerWorker.terminate()
      this.timerWorker = null
    },
    watch: {
      active (newVal, oldVal) {
        if(newVal){
          this.start_()
        }else{
          this.stop_()
        }
      },
      time (newVal, oldVal) {
        this.changeTime(newVal)
      }
    }    
  }
</script>
