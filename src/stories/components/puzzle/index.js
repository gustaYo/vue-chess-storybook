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
          description: 'Monterinas vs Max Euwe, Amsterdam, 1927. Euwe (black) moves and wins in 2.',
          type:"Mate in 2",
          userColor: 'b',
          position: false,
          fenInit: '7r/p3ppk1/3p4/2p1P1Kp/2Pb4/3P1QPq/PP5P/R6R b KQkq - 1 2',
          solutions:[['Bd4-e3','Qh3-g4']]
        }
      });
  },
}))
.add('Mate in 3', () => ({
  render(h) {
    return h(Puzzle, {
        props: {
          numMoves: 3,
          description: 'Alexander Alekhine vs Freeman, New York, 1924. Alekhine wins in 3',
          type:"Mate in 3",
          position: false,
          fenInit: '4Rnk1/pr3ppp/1p3q2/5NQ1/2p5/8/P4PPP/6K1 w KQkq - 2 1',
          solutions:['Nf5-h6','Re8xf8','Qg5-d8']
        }
      });
  },
}))
.add('Mate in 4', () => ({
  render(h) {
    return h(Puzzle, {
        props: {
          numMoves: 4,
          description: 'Veselin Topalov vs Garry Kasparov, Moscow, 1994. Topalov with white moves and wins in 4.',
          type:"Mate in 4",
          position: false,
          fenInit: '4k2r/1R3R2/p3p1pp/4b3/1BnNr3/8/P1P5/5K2 w KQkq - 1 2',
          solutions:[['Rf7-e7','Nd4-c6','Nc6-a7', 'Rb7-d7'],['Rf7-e6','Nd4-c6','Re7-e8']]
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