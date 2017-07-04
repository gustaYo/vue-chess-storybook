import Vue from 'vue'
import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import Puzzle from './puzzle.vue';

storiesOf('Puzzle', module)
.add('Find Fork', () => ({
  render(h) {
    return h(Puzzle);
  },
}))
  .add('Mate in 1', () => ({
    components: { Puzzle },
    template: '<puzzle :description="puzzle.description" :type="puzzle.type" :position="puzzle.position" :fenInit="puzzle.fenInit"></puzzle>',
    data () {
      return {
        puzzle:{
        	description: 'White is to begin and checkmate in one move.',
        	type:"Mate in 1",
        	position: false,
        	fenInit: '4Q2N/4q2k/2b4r/2pPBP2/2P3p1/5n2/1K4p1/7R w KQkq - 1 2'
        }
      }
    }
  }))
.add('Mate in 2', () => ({
  render(h) {
    return h(Puzzle, {
        props: {
          numMoves: 2,
          description: 'White is to begin and checkmate in two move.',
          type:"Mate in 2",
          position: false,
          fenInit: '7R/8/8/8/6pq/7k/4Np1r/5KbQ w KQkq - 1 2'
        }
      });
  },
}))
.add('Take Piece', () => ({
  render(h) {
    return h(Puzzle, {
        props: {
          position: true,
          description: "One of Black's pieces is undefended. Take it.",
          type:"Take Piece",
          fenInit: '8/8/3b4/8/p2R1n2/3q4/8/K6k w KQkq - 1 2',
          fenEnd: '8/8/3b4/8/R4n2/3q4/8/K6k b KQkq - 0 2'
        }
      });
  },
})) 