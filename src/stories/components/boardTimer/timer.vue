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
    created () {
      this.$store.commit('initTime',{keyName: this.keyname,c: this.color, time: this.time})
      if (this.active){
        this.$store.dispatch('countDown',{keyName: this.keyname,c: this.color})
      }
    },
    filters: {
      boardTime (s) {
        var s = s/1000
        var min = parseInt(s / 60)
        var segs = parseInt(s % 60)
       // var milisecons =s / 100
        return ('0' + min).slice(-2) + ':' + ('0' + segs).slice(-2)
        
      }
    },
    watch: {
      active (newVal, oldVal) {
        if(newVal){
          this.$store.dispatch('countDown',{keyName: this.keyname,c: this.color})
        }else{
          this.$store.dispatch('stopCountDown',{keyName: this.keyname})
        }
      },
      time (newVal, oldVal) {
        this.$store.commit('changeTime',{keyName: this.keyname,c: this.color,time: newVal})
      }
    }    
  }
</script>
