import Vue from 'vue'
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import MyChess from 'chess.js'

import BoardHistory from './boardHistory.vue';
import Board from '../chessboard/board.vue';
Vue.component('board-history', BoardHistory)

//http://www.pgnmentor.com/files.html
var pgnLoadTest = '1.d4 d5 2.c4 c6'


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

.add('Visor', () => ({
  components: { BoardHistory, Board },
  template: '<div><div style="float:left; padding: 10px;"><board :pgn="pgn" v-on:move="changePgn"></board></div><div style="float:left"><board-history :history="history" v-on:move="changePgn" :active="active"></board-history></div></div>',
  data () {
    return {
      pgn:pgnLoadTest,
      history: [],
      chess: new MyChess(),
      historyBack: false,
      active: true,
    }
  },
  methods: {
    loadHistory(){
      this.chess.load_pgn(this.pgn)
      this.history = this.chess.history({ verbose: true })        
    },
    changePgn (board) {
      if (board.pgn) {
        this.pgn = board.pgn
        if (this.historyBack) {
          this.loadHistory()
        }
      }else{
        if (board.move) {
          board.move['promotion'] = 'q';
          this.chess.move(board.move)
          this.history = this.chess.history({ verbose: true })
        }
      }
    }
  },
  mounted () {
    this.loadHistory()
  }
}))

.add('Visor read only', () => ({
  components: { BoardHistory, Board },
  template: '<div><div style="float:left; padding: 10px;"><board :mode="mode" :pgn="pgn" v-on:move="changePgn"></board></div><div style="float:left"><board-history :history="history" v-on:move="changePgn"></board-history></div></div>',
  data () {
    return {
      pgn:pgnLoadTest,
      history: [],
      chess: new MyChess(),
      historyBack: false,
      mode: {'white':false,'black':false}
    }
  },
  methods: {
    loadHistory(){
      this.chess.load_pgn(this.pgn)
      this.history = this.chess.history({ verbose: true })        
    },
    changePgn (board) {
      if (board.pgn) {
        this.pgn = board.pgn
        if (this.historyBack) {
          this.loadHistory()
        }
      }else{
        if (board.move) {
          board.move['promotion'] = 'q';
          this.chess.move(board.move)
          this.history = this.chess.history({ verbose: true })
        }
      }
    }
  },
  mounted () {
    this.loadHistory()
  } 
}))

.add('Visor user white VS PC IA worker', () => ({
  components: { BoardHistory, Board },
  template: '<div><div style="float:left; padding: 10px;"><board :vs-ia="vsIa" :mode="mode" :pgn="pgn" v-on:move="changePgn"></board></div><div style="float:left"><board-history :history="history" v-on:move="changePgn" :active="active" :vs-ia="vsIa.isVsIA"></board-history></div></div>',
  data () {
    return {
      pgn:pgnLoadTest,
      history: [],
      chess: new MyChess(),
      historyBack: true,
      active: true,
      mode: {'white':true,'black':false},
      vsIa: {isVsIA: true, color: 'b', delay: 300, mode: 'worker'}
    }
  },
  methods: {
    loadHistory(){
      this.chess.load_pgn(this.pgn)
      this.history = this.chess.history({ verbose: true })        
    },
    changePgn (board) {
      if (board.pgn) {
        this.pgn = board.pgn
        if (this.historyBack) {
          this.loadHistory()
        }
      }else{
        if (board.move) {
          board.move['promotion'] = 'q';
          this.chess.move(board.move)
          this.history = this.chess.history({ verbose: true })
        }
      }
    }
  },
  mounted () {
    this.loadHistory()
  }
}))