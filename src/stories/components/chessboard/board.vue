<template>
  <div class="chessground-component">
    <section v-bind:class="[stylesBoard['board'][currentStyle['board']],stylesBoard['pieces'][currentStyle['pieces']]]">
      <div
          ref="sboard"
          class="cg-board-wrap"
          v-bind:style="[dimentions]"           
       >
       </div>
    </section>
  </div>
</template>

<script>

import {Chessground}  from 'chessground';
import MyChess from 'chess.js'
import { toColor, toDests, aiPlay, changeBoardState, getGameState } from './utils'

import './assets/css/boardSkin.css'
import './assets/css/chessground.css'
import './assets/css/pieces.css'

var stylesBoard = {
  board: ['blue','blue2', 'wood', 'marble','gray','gray-hi','red'],
  pieces: ['merida', 'pirouetti','pirouetti-invert', 'cburnett','staunton','picture']
}
var loopTime = 1;
  export default {
    props: {
      vsIa:{
        type: Object,
        default: () => {
          return {isVsIA: false, color: 'w', delay: 1000, mode: 'random'}
        }
      },
      mode: {
        type: Object,
        default: () => {
          return {
            'white': true,
            'black': true
          }
        }
      },
      dimentions: {
        type: Object,
        default: () => {
          return {width: '420px', height: '420px'}
        }
      },
      currentStyle: {
        type: Object,
        default: () => {
          return {
            board: 1,
            pieces: 0
          }
        }  
      },
      active: {
        type: Boolean,
        default: true
      },
      handleClick: {
        default: () => () => null
      },
      fen: {
        default: ''
      },
      pgn: {
        default: ''
      },
      orientation: {
        default: 'white'
      },
      externalMove: {
        type: Object,
        default: () => {
          return {
            from: 'e2',
            to: 'e4'
          }
        }
      }
    },
    data () {
      return {
        chess: {},
        ground: 0,   
        stylesBoard: stylesBoard,
        stateGame: {},
        loopTime: 1
      }
    },
    methods: {
      changeOrientation () {
        this.orientation = this.orientation === 'white' ? 'black' : 'white'
        this.ground.set({
          orientation: this.orientation
        })
      },
      runVsIA () {
        if(this.vsIa.isVsIA){
          if((this.chess.turn()===this.vsIa.color) || this.vsIa.color==='all'){
            setTimeout(() => {
              aiPlay(this.chess,this.vsIa.mode).then((move) => {
                if (this.loopTime) {
                  this.move({move: move})
                }                
              })
            }, this.vsIa.delay)
          }
        }
      },
      move (board) {
        if (this.active){
          changeBoardState(this.ground,this.chess,board, this.mode)
          this.stateGame = getGameState(this.chess)
          this.runVsIA()
          this.$emit('move', board)
          let fen = this.chess.fen()
          this.$emit('update:fen', fen)
        }else{
          console.log(this.stateGame)
        }
      },
      onMove (orig, dest) {
        let move = {move:{from: orig, to: dest}};
        this.move(move)
      },
      stopGame(){
        this.loopTime = false
        this.ground.stop()
      },
      endGame (){
        this.stopGame()
        let boardData={}
        this.$emit('endGame',boardData)
      }
    },
    created () {
    },
    beforeDestroy () {
      this.stopGame()
    },    
    mounted () {
      this.chess = new MyChess();
      this.ground = Chessground(this.$refs.sboard, {
        movable: {
          premove: true,
          color: toColor(this.chess),
          free: false,
          dests: toDests(this.chess)
        },
        orientation: this.orientation,
        viewOnly: false,
        animation: {
          duration: 300
        },        
      });
      this.ground.set({
        movable: { events: { after: this.onMove } }
      });
      this.move({fen:this.fen})
      if(this.pgn !=''){
        this.move({pgn:this.pgn})
      }
    },
    watch: {
      fen (val, oldVal) {
        this.move({fen:val})
      },      
      pgn (val, oldVal) {
        this.move({pgn:val})
      },
      stateGame (val, oldVal) {
        if (val.motiv && val.motiv !=='in_check') {
          this.endGame()
        }
      },
      active (val, oldVal) {
        if(!val){
          this.endGame()
        }
      },
      externalMove (val, oldVal) {
        this.onMove(val.from, val.to)
      }
    }
  }
</script>

<style scoped>
  .rounded {
    border-radius: 5px;
  }

  .button {
    border: 3px solid;
    padding: 10px 20px;
    background-color: white;
    outline: none;
  }
  
</style>