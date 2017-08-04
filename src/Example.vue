<template>
  <div id="app">
    <label>Store:</label>
    {{ $store.state.board[idBoard]}}
    <br>
    <label>Style:</label>
    {{styleB}}

    <div style="padding-top: 20px; float: left; width: 100%">
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

<button @click="active=false">Resigned</button>
<button @click="orientation=orientation==='white'?'black':'white'">Invert to {{orientation}}</button>
<button @click="changeStyleBoard('board')">Change board</button>
<button @click="changeStyleBoard('pieces')">Change pieces</button>

</div>
    <div class="container">
      <div class="boardChess">
        <board
        :key-name="idBoard"
        :use-store="useStore" 
        @update:state="val => {state = val}"
        :vs-ia="vsIa"
        :mode="mode"
        :active="active"
        v-on:move="onMove"
        v-on:endGame="endGame"
        orientation='black'
        :orientation="orientation"
        :style-board="styleB['board']"
        :pieces-board="styleB['pieces']"
        :showHistory="true"
        >
      </board>
    </div>
    
</div>

</div>
</template>

<script>
  import board from './components/chessboard/index.vue';
  import BoardHistory from './components/boardHistory/index.vue'
  import timer from './components/boardTimer/index.vue'
  import {store} from './components/boardTimer/store'
  

  var pgn = '1. e4 e5 2. Nf3 Nc6 3. Ng5 b5 4. d4 d5 5. Bxb5 dxe4 6. Bxc6+ Ke7 7. Bxa8 Bb7 8. Bxb7 Qd6 9. Bxe4 f5 10. Bxf5 Kf6 11. Ne4+ Ke7 12. Nxd6 Kxd6 13. f4 c5 14. dxe5+ Kc7 15. Qd7+'

  var stylesBoard = {
    board: ['blue.svg','blue2.jpg','blue3.jpg', 'gray.svg','grey.jpg', 'gray-hi.png','marble.jpg','red.png','wood2.jpg','green.svg','purple.svg','wood3.jpg','maple.jpg','brown.svg','olive.jpg','canvas2.jpg'],
    pieces: ['merida','alpha', 'pirouetti', 'cburnett','picture','spatial','fantasy']
  }

  export default {
    name: 'example',
    store,
    data () {
      return {
        styleB: {
          board: 'blue2.jpg',
          pieces: 'merida'
        },
        timeBoard: 60*3*1000,
        idBoard: 'testSomeIdBoard',
        mode: {'white':false,'black':true},
        vsIa: {isVsIA: true, color: 'w', delay: 10, mode: 'worker'},
        active: true,
        backHistory: true,
        useStore: true,
        state:{color:'w', motiv: false},
        orientation: 'black'
      }
    },
    methods: {
      changeStyleBoard (type) {
        this.styleB[type] = stylesBoard[type].indexOf(this.styleB[type]) + 1 > stylesBoard[type].length - 1 ? stylesBoard[type][0] : stylesBoard[type][ stylesBoard[type].indexOf(this.styleB[type]) + 1]
      },
      endGame () {
        this.active = false
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


</style>
