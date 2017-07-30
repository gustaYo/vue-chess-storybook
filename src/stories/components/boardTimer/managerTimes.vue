<template>
  <div>
    Many board times
    <br />
    
    <div v-for="b in 4" :key="b">
      <timer  v-for="n in 5" :key="n" :time="60*n*1000" :keyname="'idBoard-'+n" :color="'w'" :active="activeCountDown" ></timer>
    </div> 

    <button @click="toogleCountDown">
     {{ activeCountDown ? 'Stop' : 'Start' }}
   </button>
    <br />
    <br />

    <label>White</label>
    <timer :time="timeWhite" :active="activeWhite &&  activeBoard" :keyname="'idsomeboard'"></timer>
    <label>Black</label>    
    <timer :time="timeBlack" :active="!activeWhite &&  activeBoard" :keyname="'idsomeboard'" :color="'b'"></timer>
    
   <button @click="toogleColorCountDown">
     CountDown  {{ activeWhite ? 'Black' : 'White' }}
   </button>    
   <button @click="changeTime">
     Add 5 seconds
   </button>
   <button @click="activeBoard = false">
     Stop all
   </button>

   <br /><br />
   {{ $store.state.board}}
 </div>
</template>
<script>
import timer from './timer.vue'
import {store} from './store'
  export default {
    store,
    data () {
     return {
      activeBoard: true,
      activeCountDown: true,
      timeCustom: 60*4*1000,
      activeWhite: true,
      timeWhite: 60*4*1000,
      timeBlack: 60*4*1000
     }
   },
    components: {
      timer
    },
    methods: {
      toogleColorCountDown () {
        //this.$store.commit('actionW',{keyName: 'idsomeboard', fun: 'toogleColor'})
        this.activeWhite = !this.activeWhite       
      },
      toogleCountDown () {
        this.activeCountDown = !this.activeCountDown
      },
      changeTime(){
        this.timeBlack = this.$store.state.board['idsomeboard'].times['b'] + 1000*5
        this.timeWhite = this.$store.state.board['idsomeboard'].times['w'] + 1000*5
      }
    }
  }
</script>