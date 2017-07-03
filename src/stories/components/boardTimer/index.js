import Vue from 'vue'
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import {
  addonKnobs,
  number,
} from '@storybook/addon-knobs';

import BoardTimer from './boardTimer.vue';
Vue.component('board-timer', BoardTimer)

storiesOf('BoardTimer', module)
  .add('default', () => ({
    components: { BoardTimer },
    template: '<board-timer></board-timer>',
  }))
    .add('custom time', () => ({
    render(h) {
      return h(BoardTimer, { props: { time: 70 } });
    },
  }))