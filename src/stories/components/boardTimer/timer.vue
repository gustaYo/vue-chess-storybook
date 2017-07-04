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
        default: 10
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
        var min = parseInt(s / 60)
        var segs = s % 60
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
      }
    }    
  }
</script>
