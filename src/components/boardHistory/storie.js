import Vue from 'vue'
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import MyChess from 'chess.js'
import BoardHistory from './index.vue';
import Board from '../chessboard/index.vue';
import {store} from '../boardTimer/store'


Vue.component('board-history', BoardHistory)

//http://www.pgnmentor.com/files.html
var pgnLoadTest = '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Be7 5.O-O O-O 6.c3 d6 7.Nbd2 Na5 8.Re1 Nxc4 9.Nxc4 h6 10.h3 Be6 11.Ne3 Re8 12.g4 g6 13.c4 Bf8 14.Bd2 Bg7 15.Kh2 c6 16.Bc3 Qb6 17.Qd2 Qc7 18.Rg1 Kh7 19.Rg3 Rad8 20.Rag1 Bc8 21.h4 d5 22.exd5 cxd5 23.g5 d4 24.gxf6 dxc3 25.bxc3 Bxf6 26.Nd5 Rxd5 27.cxd5 Qd6 28.c4 e4 29.Re1 Bf5 30.dxe4 Bxe4 31.Kg1 Qd8 32.Qf4 Bf5 33.Rxe8 Qxe8 34.h5 Qe2 35.hxg6+ fxg6 36.d6 Bg7 37.Qd2 Qxd2 38.Nxd2 Be5 39.Rb3 b6 40.c5 Be6 41.Re3  1-0'

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
