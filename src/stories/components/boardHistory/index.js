import Vue from 'vue'
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import MyChess from 'chess.js'

import BoardHistory from './boardHistory.vue';
Vue.component('board-history', BoardHistory)

storiesOf('BoardHistory', module)

.add('In template', () => ({
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