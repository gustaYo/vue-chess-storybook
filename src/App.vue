<template>
  <div id="app">
    {{ $store.state.board[idBoard]}}
    <div class="container">
      <div class="boardChess">
        <board 
        :key-name="idBoard"
        :use-store="useStore" 
        @update:history="onHistoryChange"
        @update:state="val => {state = val}"
        :vs-ia="vsIa"
        :mode="mode"
        :pgn="pgn"
        :active="active"
        v-on:move="onMove"
        v-on:endGame="endGame"
        orientation='black'
        >
      </board>
    </div>
    <div class="historyChess">
      State : {{state}} {{active}}
      <br>
      <label>White time: </label>
      <timer
      :time="timeBoard"
      :active="state.color === 'w' && active"
      :keyname="idBoard"
      >
    </timer>
      <label>Black time: </label>
      <timer 
      :time="timeBoard"
      :active="state.color !== 'w' && active"
      :color="'b'"
      :keyname="idBoard"
      >
    </timer>
  <board-history 
  :history="history"
  v-on:move="historyIndex"
  :active="active"
  :back-history="backHistory"
  >
</board-history>
</div>
</div>
<button @click="active=false">Desactive</button>
</div>
</template>

<script>
  import board from './stories/components/chessboard/board.vue';
  import BoardHistory from './stories/components/boardHistory/boardHistory.vue'
  import timer from './stories/components/boardTimer/timer.vue'
  import {store} from './stories/components/boardTimer/store'

  var pgn = '1. e4 e5 2. Nf3 Nc6 3. Ng5 b5 4. d4 d5 5. Bxb5 dxe4 6. Bxc6+ Ke7 7. Bxa8 Bb7 8. Bxb7 Qd6 9. Bxe4 f5 10. Bxf5 Kf6 11. Ne4+ Ke7 12. Nxd6 Kxd6 13. f4 c5 14. dxe5+ Kc7 15. Qd7+'

  export default {
    name: 'app',
    store,
    data () {
      return {
        timeBoard: 60*3*1000,
        idBoard: 'testSomeIdBoard',
        mode: {'white':true,'black':true},        
        pgn:'',
        vsIa: {isVsIA: false, color: 'w', delay: 10, mode: 'worker'},
        history: [],
        active: true,
        backHistory: true,
        useStore: true,
        state:{color:'w', motiv: false}
      }
    },
    methods: {
      endGame () {
        this.active = false
      },
      onHistoryChange(history) {
        this.history = history
      },
      historyIndex({pgn}){
        this.pgn = pgn
      },
      onMove ({move}) {
        if(move){
          console.log(move)
        }
      }
    },  
    components:{
      board,
      BoardHistory,
      timer
    }
  }
</script>

<style>

  .container{
    width: 100%;
    float: left;
    padding: 10px;
  }
  .boardChess{
    float: left;
  }
  .historyChess{
    padding-left: 20px;
    float: left;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
  cent
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
