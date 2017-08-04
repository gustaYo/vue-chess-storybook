<template>
  <span v-bind:class="[className]">
  	{{ $store.state.board[keyname].times[color] | boardTime}}
  </span>
</template>

<script>
  export default {
    props: {
      time: {
        type: Number,
        default: 1*60*1000
      },
      active: {
        type: Boolean,
        default: false
      },
      keyname: {
        default: 'timerBoard'
      },
      color: {
        default: 'w'
      },
      className: {
        default: 'flat-text-board-timer'
      }
    },
    methods: {
      changeTime (time) {
        this.$store.commit('changeTime',{keyName: this.keyname,c: this.color, time: time})
        var pp = {
          keyName: this.keyname,
          fun: 'setTime',
          arg: {
            [this.color]: time
          }
        }
        this.$store.commit('actionW',pp)        
      },
      initTime () {
        this.$store.dispatch('initTime',{keyName: this.keyname,c: this.color, time: this.time, active: this.active})
      }
    },
    created () {
      this.initTime()
      // this.$store.commit('actionW',{keyName: this.keyname, fun: this.active ? 'start' : 'stop', arg: this.color})
    },
    filters: {
      boardTime (s) {
        var s = s/1000
        var min = parseInt(s / 60)
        var segs = parseInt(s % 60)
        return ('0' + min).slice(-2) + ':' + ('0' + segs).slice(-2)        
      }
    },
    watch: {
      active (newVal, oldVal) {
        if(newVal){
          this.$store.commit('actionW',{keyName: this.keyname,c: this.color, fun: 'start', arg: this.color})
        }else{
          this.$store.commit('actionW',{keyName: this.keyname,c: this.color, fun: 'stop', arg: this.color})
        }
      },
      time (newVal, oldVal) {
        this.changeTime(newVal)
      }
    }
  }
</script>
