<template>
  <div class="chessground-component">
  <scroll-direction v-on:scrolld="eventScrollDirection"
   
    <section v-bind:class="'merida'">
      <div
      ref="sboard"
      class="cg-board-wrap"
      v-bind:style="[dimentions,backgroundBoard]"
      >
    </div>
  </section>
  </scroll-direction>
 
</div>
</template>

<script>

  import {Chessground}  from 'chessground';
  import MyChess from 'chess.js'
  import GarbochessWorker from 'worker-loader!./assets/js/garbochess';
  import { toColor, toDests, aiPlay, changeBoardState, getGameState } from './utils'
  import ScrollDirection from '../scrollStaticDirection/scrollDirection.vue'

  import jQuery from 'jquery'
  import './assets/css/styleBoard.css'
  import './assets/css/chessground.css'
  import './assets/css/pieces.css'

  export default {
    props: {
      vsIa:{
        type: Object,
        default: () => {
          return {isVsIA: false, color: 'w', delay: 1000, mode: 'random'}
        }
      }, 
      keyName: {
        default: 'someId'
      },
      styleBoard: {
        default: 'blue2.jpg'
      },
      piecesBoard: {
        default: 'merida'
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
      useStore: {
        type: Boolean,
        default: false
      },      
      active: {
        type: Boolean,
        default: true
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
        stateGame: {},
        loopTime: true,
        garbochessWorker: {},
        timesHistory: [],
        currentIndex: 0,
        history: [],
        globalHistory: []
      }
    },
    computed:{
      backgroundBoard(){
        var type = this.styleBoard
        var url = 'images/board/'+ type
        return {backgroundImage: "url('"+url+"')"}
      }
    },
    components:{
      ScrollDirection
    },
    methods: {
      eventScrollDirection (dir) {
        if (dir === 'up') {
         this.currentIndex ++
        }
        if (dir === 'down') {
         this.currentIndex --
        }
        if(this.currentIndex <0){
          this.currentIndex = -1
        }
        if (this.currentIndex > this.globalHistory.length-1) {
          this.currentIndex = this.globalHistory.length-1
        }
        this.$emit('moveIndex',this.currentIndex)
      },
      changeOrientation () {
        this.orientation = this.orientation === 'white' ? 'black' : 'white'
        this.ground.set({
          orientation: this.orientation
        })
      },
      runVsIA () {
        if(this.isIAColorTurn()){
          setTimeout(() => {
            aiPlay(this.chess,this.vsIa.mode, this.garbochessWorker).then((move) => {
              if (this.isIAColorTurn()) {
                this.move({move: move})
              }                
            })
          }, this.vsIa.delay)
        }
      },
      changePieceStyle(){
        var urlPieces = 'images/pieces/'+this.piecesBoard
        var pieces = [{name:'pawn',key:'P'},{name:'bishop',key:'B'},{name:'knight',key:'N'},{name:'rook',key:'R'},{name:'queen',key:'Q'},{name:'king',key:'K'}]
        var colors = [{name:'white',key:'w'},{name:'black',key:'b'}]
        var loadColor = (color) =>{
          pieces.map(({name,key},index)=>{
            var url = urlPieces+'/'+color.key+key+'.svg'
            jQuery('.cg-board piece.'+name+'.'+color.name).css({
              'background-image': "url("+url+")"
            })
          })
        }
        colors.map((color,index)=>{
          loadColor(color)
        })        
      },
      isIAColorTurn(){
        return this.loopTime && this.vsIa.isVsIA && (this.chess.turn()===this.vsIa.color) || this.vsIa.color==='all'
      },
      getTimeRegisterInGame () {
        if (this.useStore) {
          var history = this.chess.history()
          var post = history.length-1
          if (post>=0) {
            if (history.length % 2 === 0) {
              this.$store.commit('changeTime',{keyName:this.keyName, c: 'w', time: this.timesHistory[post] || 0})
              if (this.timesHistory[post-1]) {
                this.$store.commit('changeTime',{keyName:this.keyName, c: 'b', time: this.timesHistory[post-1] || 0})
              };
            }else{
              this.$store.commit('changeTime',{keyName:this.keyName, c: 'b', time: this.timesHistory[post] || 0})
              if (this.timesHistory[post+1]) {
                this.$store.commit('changeTime',{keyName:this.keyName, c: 'w', time: this.timesHistory[post+1] || 0})
              };
            }                       
          }          
        }
      },
      registerTimeMove (lengthHistory) {
        if (this.useStore) {
          if (this.timesHistory.length > lengthHistory) {
            var times = this.timesHistory.slice(0,lengthHistory)
            this.timesHistory = times
          }else{
            var turn = this.chess.turn()

            if (this.$store.state.board[this.keyName] && this.$store.state.board[this.keyName].times && this.$store.state.board[this.keyName].times[turn]) {
              var time = this.$store.state.board[this.keyName].times[turn]
              this.timesHistory.push(time)
            };
            
          }          
        }        
      },
      move (board) {
        if (this.active){
          var state= changeBoardState(this.ground,this.chess,board, this.mode)
          this.stateGame = getGameState(this.chess)
          this.runVsIA()
          this.$emit('move', board)
          this.$emit('update:fen', state.fen)
          //this.$emit('update:pgn', state.pgn)
          var history = state.history
          var fenINit = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
          if (fenINit !==state.fen) {
            this.registerTimeMove(history.length)
          }else{
            this.timesHistory = []
          }
          this.history = history
          var board = {
            fen: state.fen,
            pgn: state.pgn
          }
          this.updateBoardState(board)
        }else{
          var state= changeBoardState(this.ground,this.chess,board, this.mode)
          if (this.history.length === 0) {
            this.history = state.history
          }
          this.getTimeRegisterInGame()
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
        this.$emit('endGame',true)
      },
      changeStyleBoard(style){
        var url = 'images/board/'+style
        jQuery(this.$refs.sboard).css({
          'background-image': "url("+url+")"
        })
      },
      updateBoardState(state){
        if (this.useStore) {
          this.$store.commit('updateStateBoard',{[this.keyName]:state})
        };
      }
    },
    created () {
      var board = {
        fen: this.fen,
        pgn: this.pgn
      }
      this.updateBoardState(board)
      if (this.vsIa.isVsIA && this.vsIa.mode !== 'random') {
        this.garbochessWorker = new GarbochessWorker()
      };
    },
    beforeDestroy () {
      this.stopGame()
      if (this.vsIa.isVsIA && this.vsIa.mode !== 'random') {
        this.garbochessWorker.terminate()
        this.garbochessWorker = null         
      }
    },
    mounted () {
      this.chess = new MyChess();
      this.ground = Chessground(this.$refs.sboard, {
        predroppable:{
          enabled: true
        },
        movable: {
          free: false,
          dests: toDests(this.chess),
          events: { after: this.onMove }
        },
        orientation: this.orientation,
        viewOnly: false,
        animation: {
          enabled: true,
          duration: 300
        }        
      });
      this.move({fen:this.fen})
      if(this.pgn !=''){
        this.move({pgn:this.pgn})
      }
      setTimeout(()=>{
        this.changePieceStyle()
      },100)   
    },
    watch: {
      piecesBoard (val, oldVal) {
        this.changePieceStyle(val)        
      },
      orientation (val, oldVal) {
        this.ground.set({orientation: val})
      },
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
        this.$emit('update:state', val)
        this.updateBoardState({state: val})
      },
      active (val, oldVal) {
        if(!val){
          this.endGame()
        }
      },
      history( val, oldVal){
        if (this.globalHistory.length === 0 && val.length > this.globalHistory.length) {
          this.globalHistory = val
        }
        if (this.active) {
          this.globalHistory = val
        }
        this.$emit('update:history', val)
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