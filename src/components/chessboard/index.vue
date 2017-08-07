<template>
  <div class="chessground-component">
    <div style="float:left">
      <scroll-direction v-on:scrolld="eventScrollDirection">
        <div 
        ref="sboard"
        class="cg-board-wrap"
        v-bind:style="[dimentions,backgroundBoard]"
        >
      </div>
    </scroll-direction>
  </div>
    <board-history 
    v-if="showHistory"
    :index-move="currentIndex"
    :history="history"
    v-on:move="this.move"
    :active="active"
    :back-history="true"
    >
  </board-history>
</div>
</template>

<script>

  import {Chessground}  from 'chessground';
  import MyChess from 'chess.js'
  import GarbochessWorker from 'worker-loader!./assets/js/garbochess';
  import { toColor, toDests, aiPlay, changeBoardState, getGameState,soundBoard } from './utils'
  import ScrollDirection from '../scrollStaticDirection/index.vue'
  import BoardHistory from '../boardHistory/index.vue'

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
      useFastMove: {
        type: Boolean,
        default: true
      },
      showHistory: {
        type: Boolean,
        default: false
      },
      active: {
        type: Boolean,
        default: true
      },
      useStore: {
        type: Boolean,
        default: false
      },      
      sound: {
        type: Boolean,
        default: true
      },
      viewOnly: {
        type: Boolean,
        default: false
      },      
      fen: {
        default: ''
      },
      pgn: {
        default: ''
      },
      promotion: {
        default: 'q'
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
        currenPgn: '',
        loopTime: true,
        garbochessWorker: {},
        timesHistory: [],
        currentIndex: 0,
        history: [],
        globalHistory: [],
        fastMove: {}
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
      ScrollDirection,
      BoardHistory
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
        var history = this.timesHistory.length
        var post = this.currentIndex
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
    playSound(type){
      if (this.sound) {
        soundBoard(type)
      }
    },
    fastMovePremovable(role, key){
      this.fastMove = {
        from: role,
        to: key
      }
    },
    move (board) {
      if (this.active){
        var state= changeBoardState(this.ground,this.chess,board, this.mode, this.currenPgn)
        var history = state.history
        delete state['history']
        this.stateGame = state
        this.runVsIA()
        this.$emit('move', board)
        this.$emit('update:fen', state.fen)        
        var fenINit = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        if (fenINit !==state.fen) {
            this.registerTimeMove(history.length)
        }else{
          this.timesHistory = []
        }
        this.history = history
        this.currenPgn = state.pgn
        if (this.fastMove.from && this.useFastMove) {
          var move = this.fastMove
          this.fastMove = {}
          this.move({move:move})
        }
      }else{
        var state= changeBoardState(this.ground,this.chess,board, this.mode)
        this.currenPgn = state.pgn
        if (this.history.length === 0) {
          this.history = state.history
        }
        this.currentIndex = state.history.length -1
        this.getTimeRegisterInGame()
      }
      this.playSound('move')
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

    },
    created () {
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
        premovable:{
          enabled: true,
          showDests: true,
          castle: true,          
          events: {
            set: this.fastMovePremovable
          }
        },
        movable: {
          free: false,
          dests: toDests(this.chess),
          events: { after: this.onMove }
        },
        orientation: this.orientation,
        viewOnly: this.viewOnly,
        animation: {
          enabled: true,
          duration: 300
        },
        events:{
          //select: this.onSelectS
        }
      });
      this.move({fen:this.fen})
      if(this.pgn !=''){
        this.move({pgn:this.pgn})
        this.currenPgn = this.pgn
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
        this.currenPgn = val
      },
      stateGame (val, oldVal) {
        if (val.state.motiv && val.state.motiv !=='in_check') {
          this.endGame()
        }
        this.$emit('update:state', val)
      },
      active (val, oldVal) {
        if(!val){
          this.endGame()
        }
      },
      history( val, oldVal){
        if (this.globalHistory.length === 0 && val.length > this.globalHistory.length) {
          this.globalHistory = val
          this.currentIndex = val.length -1
        }
        if (this.active) {
          this.globalHistory = val
          this.currentIndex = val.length -1 
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
  

  
</style>