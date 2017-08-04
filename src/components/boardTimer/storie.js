import Vue from 'vue'
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import {
  addonKnobs,
  number,
} from '@storybook/addon-knobs';

import BoardTimer from './index.vue';
import ManagerTimer from './managerTimes.vue';

import {store} from './store'

storiesOf('BoardTimer', module)
  .add('Default', () => ({
    components: { BoardTimer },
    store: store,
    template: '<board-timer></board-timer>',
  }))
  .add('Default start', () => ({
    components: { BoardTimer },
    store: store,
    template: '<board-timer :keyname="idBoard" :active="active"></board-timer>',
    data () {
      return {
        idBoard: 'defaultStart',
        active: true
      }
    }  
  }))
  .add('Many times', () => ({
    render(h) {
      return h(ManagerTimer);
    },
  }))

