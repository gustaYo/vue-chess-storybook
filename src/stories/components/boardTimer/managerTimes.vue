<template>
  <div>
    components
    <br />
    <timer  v-for="n in 1" :key="n" :time="60*n*1000" :keyname="'idBoard-'+n" :color="'w'" :active="activeCountDown" ></timer>
    
    <timer :time="timeCustom" :active="true" :keyname="'idsomeboardfg'" :color="'b'"></timer>
    <button @click="toogleCountDown">
     {{ activeCountDown ? 'Stop' : 'Start' }}
   </button>
   <button @click="changeTime">
     Change Time
   </button>
   <br /><br />
   <timer :time="50" :keyname="'otherId'" :color="'b'"></timer>
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
      activeCountDown: true,
      count: 3,
      timeCustom: 60*1*1000
     }
   },
    components: {
      timer
    },
    methods: {
      toogleCountDown () {
        this.activeCountDown = !this.activeCountDown
      },
      changeTime(){
        this.timeCustom = 2*60*1000
      }
    },
    computed:{
      countDown(){
         setInterval(() =>
         {
            this.count --
         },1000
         )
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