<template>

  <div style="width: 235px">
    <ul class="history-board" ref="containerMoves">
      <li @dblclick="initPosition(index)" v-for="(move, index) in historyMove" @click="moveToHistory(index)" v-bind:ref="'item' + index" class="col s6 m6 l6" style="padding: 0 0 !important" v-bind:class="[select === index ? 'item-select' : '']">
        <span>
          <label v-if="index % 2 ===0">{{ (index/2)+1 }}.</label>
          <img alt="" v-bind:src="urlPiece(move)" height="15" width="15">
          <label><!--{{ move.from }}>{{ move.to }}--> {{ move.san }}</label>
        </span>
      </li>
    </ul>
    <div class="button-moves" v-show="!active">
      <button class="waves-effect waves-light col s2 m2 l2" @click="moveToHistory(select - 1)">
       <<
     </button>
     <button class="" @click="play()">
      {{ played ? '||' : '>' }}
    </button>
    <button class="" @click="moveToHistory(select + 1)">
      >>
    </button>
    <label class="col s1 m1 l1">{{velo}}</label>
    <input v-model="velo" type=range min=0 max=5 step=1 class="col s4 m4 l4">         
  </div>
</div>

</template>

<script>

import Jquery from 'jquery'

var playEvent = 1
export default {
  name: 'BoardHistory',
  props: {
    history: {
      type: Array,
      default: function () {
        return []
      }
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    },
    backHistory: {
      type: Boolean,
      required: false,
      default: false
    },
    handleMove: {
      type: Function,
      required: false,
      default: function () {
        return {}
      }
    },
    pieces:{
      default: 'picture'
    }
  },
  data () {
    return {
      velo: 2,
      select: -1,
      played: false,
      historyMove: []
    }
  },
  methods: {
    initPosition(index){
      if(index===0){
        this.sendEvent('init')
      }
    },
    urlPiece (move) {
      return '/images/pieces/'+this.pieces+'/' + move.color + move.piece.toUpperCase() + '.svg'
    },
    moveToHistory (index) {
      if (index < 0) {
        this.sendEvent('init')
        this.select = -1
      };
      if (index < 0 || index > this.historyMove.length - 1) {
        clearInterval(playEvent)
        this.played = false
        return
      }
      this.select = index
      var pgnReturn = ''
      var jugada = 0
      for (var i = 0; i <= index; i++) {
        if (i % 2 === 0) {
          jugada++
          pgnReturn += jugada + '. '
        }
        pgnReturn += this.historyMove[i].san + ' '
      }
      if (!this.active) {
          this.sendEvent(pgnReturn)
        return
      }
      if (this.backHistory) {
        this.sendEvent(pgnReturn)
        return
      }
    },
    sendEvent(pgn){
      this.$emit('move', {pgn: pgn})
      this.handleMove({pgn: pgn})
    },
    play () {
      this.played = !this.played
      if (this.played) {
        playEvent = setInterval( () =>{
          this.moveToHistory(this.select + 1)
        }, parseInt(this.velo) * 1000)
      } else {
        clearInterval(playEvent)
      }
    }
  },
  created () {
    if(this.history.length>this.historyMove.length){
      this.historyMove = this.history
    }
  },  
  watch: {
    history (newVal, oldVal) {
      if(this.historyMove.length<newVal.length){
        this.historyMove = newVal
        setTimeout(()=>{
          this.select = this.historyMove.length - 1
        },300)        
      }else{
        if (this.backHistory) {
          this.historyMove = newVal
        };
      }
    },
    velo (newVal, oldVal) {
      clearInterval(playEvent)
      this.played = false
      this.play()
    },
    select (newVal, oldVal) {
      var divScroll = this.$refs.containerMoves
      var el = this.$refs['item'+newVal]
      var position = Jquery(el).position();
      var top = 0
      if (divScroll.clientHeight <= position.top + 10) {
        top = divScroll.scrollTop + divScroll.clientHeight/2
      }
      if (position.top-10<0) {
        top = divScroll.scrollTop - divScroll.clientHeight/2        
      }
      if(top!==0){
        Jquery(divScroll).stop(0,0).animate({
          'scrollTop': top
        }, 'slow')
      }    
    }    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.button-moves{
  padding: 1px;
}
ul.history-board li{
  display: inline-block;
  margin: 0 0px;
  width: 50%;
  float: left;
  text-align: left;
  list-style-type: none;
}

ul.history-board li:hover{
    background-color: #B9D4CB;
}
.historyMove {
  width: 50%;
  float: left
}

.history-board{
  padding: 0;
  height: 60vh;
  overflow: auto
}

  button {
    border: 3px solid;
    padding: 5px 10px;
    background-color: white;
    outline: none;
  }
 
 .item-select {
    background-color: #5f6b44;;
  }

</style>