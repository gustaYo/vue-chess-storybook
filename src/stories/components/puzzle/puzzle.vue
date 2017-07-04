<template>
  <div>
    <board 
      v-on:move="move"
      :fen="fenInit"
      :vs-ia="vsIA"
      :mode="mode"
      @update:fen="val => {fen = val}"
      :active="active"
       ></board>
    <div v-if="wins">
      <h2>wins</h2>
    </div>
    <br />
    {{type}}
    <br />
    {{description}}
    <br />
    {{fen}}
    <br />
    {{moves}} {{numMoves}}
    <br />
    {{fenEnd}}
  </div>

</template>

<script>

var loopTime=0
import Board from '../chessboard/board.vue'
import MyChess from 'chess.js'

  export default {
    props: {
      numMoves: {
        type: Number,
        default: 1
      },
      type: {
        default: 'Find Fork'
      },
      description: {
        default: "Find White's move that results in fork."
      },
      position: {
        type: Boolean,
        default: true
      },
      turn: {
        default: 'white'
      },
      userColor: {
        default: 'white'
      },      
      fenInit: {
        default: 'R4q1k/6p1/7p/2b4N/8/2B5/1PP2r2/1K5R w KQkq - 0 2'
      },
      fenEnd: {
        default: 'R4q1k/6B1/7p/2b4N/8/8/1PP2r2/1K5R b KQkq - 0 2'
      },
    },
    data () {
      return {
        moves: (parseInt(this.numMoves) * 2) -1 ,
        wins: false,
        active: true,
        fen: '',
        vsIA: {isVsIA: !this.position, color: 'b', delay: 1000, mode: 'random'},
        mode: {'white':this.userColor==='white','black':this.userColor==='black'}
      }
    },
    components:{
      Board
    },
    methods: {
      move (board) {
        console.log(board)
      },
      isGameOver(){
        let chess = new MyChess(this.fen)
        return chess.game_over()
      },
      isPuzzleFinish(){
        if(this.position){
          if(this.fenEnd === this.fen){
            console.log('position_found')
            this.wins = true
            this.active = false
          }
        }else{
          if(this.isGameOver()){
            console.log('game_over')
            this.wins = true
          }
        }        
      },
      determinePosition(){
        if (this.moves <= 0) {
          this.isPuzzleFinish()
          this.active = false
          if(!this.wins){
            console.log('your lost')
          }
        }else{
          this.isPuzzleFinish()
        }
      }
    },
    watch: {
      fen (val, oldVal) {
        this.determinePosition()
        this.moves --
      },
      moves (val, oldVal) {
        if (val < 0) {
          this.moves = 0
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