import Vue from 'vue'
import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';

import scrollDirection from './scrollDirection.vue';

storiesOf('ScrollDirection', module)
  .add('Example', () => ({
    components: { scrollDirection },
    template: '<div style="width: 100%;height: 180vh;background-color: #7d7d73;padding: 60px;"><scroll-direction v-on:scrolld="eventScrollDirection"></scroll-direction></div>',
    methods: {
      eventScrollDirection (dir) {
      	action('scrollDir')(dir);
      }
    }
  }))