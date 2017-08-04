import Vue from 'vue'
import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';


import Welcome from '../Welcome.vue';
import AppExample from '../../Example.vue';

storiesOf('Example', module)
.add('Example', () => ({
  render(h) {
    return h(AppExample);
  },
}))


storiesOf('Welcome', module)
.add('HelloHelloHello', () => ({
  render(h) {
    return h(Welcome);
  },
}))
