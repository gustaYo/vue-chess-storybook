import Vue from 'vue'
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import MyChess from 'chess.js'

import BoardHistory from './boardHistory.vue';
import Board from '../chessboard/board.vue';



import {store} from '../boardTimer/store'


Vue.component('board-history', BoardHistory)

//http://www.pgnmentor.com/files.html
var pgnLoadTest = '1. e4 e5 2. Nf3 Nc6 3. Ng5 Qxg5 4. f4 exf4'

var myMixin = {
  store: store,
  data () {
    return {
      pgn:pgnLoadTest,
      history: [],
      backHistory: false,
      active: true,
      useStore: false,
      indexHistory: -1
    }
  },
  methods: {
    modeToIndex(index){
      this.indexHistory = index
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
  }
}

storiesOf('BoardHistory', module)

.add('Default', () => ({
  components: { BoardHistory },
  template: '<board-history></board-history>'
}))

.add('From fen', () => ({
  render(h) {
    var chess = new MyChess();
    chess.move('e4');
    chess.move('e5');
    chess.move('f4');
    chess.move('exf4');
    const history = chess.history({ verbose: true })
    const log = (move) => {
      action('move history')(move.pgn);
    }
    return h(BoardHistory, { props: { history: history ,handleMove:log} });
  },
}))

.add('Visor not back history', () => ({
  components: { BoardHistory, Board },
  template: '<div><div style="float:left; padding: 10px;"><board :use-store="useStore"  @update:history="onHistoryChange" :pgn="pgn" v-on:move="onMove"></board></div><div style="float:left"><board-history :history="history" v-on:move="historyIndex" :active="active"></board-history></div></div>',
  mixins: [myMixin]
}))

.add('Visor with back history', () => ({
  components: { BoardHistory, Board },
  template: '<div><div style="float:left; padding: 10px;"><board :use-store="useStore" @update:history="onHistoryChange" :pgn="pgn" v-on:move="onMove"></board></div><div style="float:left"><board-history :back-history="backHistory" :history="history" v-on:move="historyIndex" :active="active"></board-history></div></div>',
  data () {
    return {
      backHistory: true
    }
  },  
  mixins: [myMixin]
}))

.add('Visor read only', () => ({
  components: { BoardHistory, Board },
  template: '<div><div style="float:left; padding: 10px;"><board :active="false" v-on:moveIndex="modeToIndex" :use-store="useStore" @update:history="onHistoryChange" :mode="mode" :pgn="pgn" v-on:move="onMove"></board></div><div style="float:left"><board-history :index-move="indexHistory" :history="history" v-on:move="historyIndex"></board-history></div></div>',
  data () {
    return {
      mode: {'white':false,'black':false}
    }
  },
  mixins: [myMixin]
}))

.add('Visor read only scroll event fire', () => ({
  components: { BoardHistory, Board },
  template: '<div><div style="float:left; padding: 10px;"><board :use-store="useStore" @update:history="onHistoryChange" :mode="mode" :pgn="pgn" v-on:move="onMove"></board></div><div style="float:left"><board-history :history="history" v-on:move="historyIndex"></board-history></div></div>',
  data () {
    return {
      mode: {'white':false,'black':false}
    }
  },
  mixins: [myMixin]
}))

.add('Visor user white VS PC IA worker', () => ({
  components: { BoardHistory, Board },
  template: '<div><br/><div style="float:left; padding: 10px;"><board :use-store="useStore"  @update:history="onHistoryChange" :vs-ia="vsIa" :mode="mode" :pgn="pgn" v-on:move="onMove"></board></div><div style="float:left"><board-history :history="history" v-on:move="historyIndex" :active="active" :back-history="backHistory"></board-history></div></div>',
  data () {
    return {
      backHistory: true,
      active: true,
      mode: {'white':true,'black':false},
      vsIa: {isVsIA: true, color: 'b', delay: 300, mode: 'worker'}
    }
  },
  mixins: [myMixin]
}))
