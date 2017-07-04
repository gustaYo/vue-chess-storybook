<template>
  <div>
    components
    <br />
    <timer :time="60" :keyname="'idsomeboard'" :color="'w'" :active="activeCountDown" ></timer>
    <timer :time="50" :keyname="'idsomeboard'" :color="'b'"></timer>
    <button @click="toogleCountDown">
     {{ activeCountDown ? 'Stop' : 'Start' }}
   </button>
   <br /><br />
   <timer :time="50" :keyname="'otherId'" :color="'b'"></timer>
   <br /><br />
   {{$store.state.board}}
 </div>
</template>



<script>
import timer from './timer.vue'
import {store} from './store'

  export default {
    store,
    data () {
     return {
      activeCountDown: true
     }
   },
    components: {
      timer
    },
    methods: {
      toogleCountDown () {
        this.activeCountDown = !this.activeCountDown
      }
    },   
    mounted  () {
      //this.$store.dispatch('countDown',{keyName: 'idsomeboard',c: 'w'})
      this.$store.dispatch('countDown',{keyName: 'otherId',c: 'b'})
    },    
    watch: {
      message (newVal, oldVal) {
        //this.$store.commit('setStoredNumber',newVal)
      }
    }
  }
</script>