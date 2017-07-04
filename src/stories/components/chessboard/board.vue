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

import './assets/boardSkin.css'
import './assets/chessground.css'
import './assets/pieces.css'

var stylesBoard = {
  board: ['blue','blue2', 'wood', 'marble','light-wood-3d', 'in3d'],
  pieces: ['merida', 'pirouetti','pirouetti-invert', 'cburnett','staunton']
}
  export default {
    props: {
      vsIa:{
        type: Object,
        default: function () {
          return {isVsIA: false, color: 'w', delay: 1000, mode: 'random'}
        }
      },
      mode: {
        type: Object,
        default: function(){
          return {
            'white': true,
            'black': true
          }
        }
      },
      dimentions: {
        type: Object,
        default: function () {
          return {width: '420px', height: '420px'}
        }
      },
      currentStyle: {
        type: Object,
        default: function () {
          return {board: 1,pieces: 0}  
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
      }
    },
    data () {
      return {
        chess: {},
        ground: 0,   
        stylesBoard: stylesBoard,
        stateGame: {},
        loopTime: 0
      }
    },
    events: {
      move (board) {
        this.move(board)
      },
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
                this.loopTime = setTimeout(function () {
                  aiPlay(this.chess,this.vsIa.mode).then((move) => {
                    this.move({move: move})
                  })
                }.bind(this), this.vsIa.delay)
          }
        }
      },
      move (board) {
        if (this.active){
          changeBoardState(this.ground,this.chess,board, this.mode)
          this.stateGame = getGameState(this.chess)
          this.runVsIA()
          this.$emit('move', board)
          const fen = this.chess.fen()
          this.$emit('update:fen', fen)
        }else{
          console.log(this.stateGame)
        }
      },
      onMove (orig, dest) {
        const move = {move:{from: orig, to: dest}};
        this.move(move)
      },
      endGame (){
        clearTimeout(this.loopTime)
        this.ground.stop()
        var boardData={}
        this.$emit('endGame',boardData)
      }
    },
    created () {
      clearTimeout(this.loopTime)
      console.log('componente created')
    },
    destroyed () {
      clearTimeout(this.loopTime)
      console.log('componente destroyed')
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
      stateGame (val, oldVal) {
        if ((val.motiv && val.motiv !=='in_check')||val.finish) {
          this.endGame()
        }
      },
      active (val, oldVal) {
        if(!val){
          this.endGame()
        }
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