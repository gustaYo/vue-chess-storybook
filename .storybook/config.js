import { configure, setAddon } from '@storybook/vue';
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
function loadStories() {
  require('../src/stories');
}
configure(loadStories, module);
