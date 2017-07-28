import Vue from 'vue'
import Vuex from 'vuex';
import deepmerge from 'deepmerge';
var timesLoop = {}
export const store = new Vuex.Store({
  state: {
    board:{}
  },
  mutations: {
    updateStateBoard (state, newState) {
      Vue.set(state,'board', deepmerge(state.board, newState))
    },
    changeTime (state, parms) {
      Vue.set(state.board[parms.keyName].times,parms.c, parms.time)
    },
    initTime (state, parms) {
      var indexName = parms.keyName    
      if(!state.board[parms.keyName]){
        var time = {}
        time[parms.c] = parms.time
        var times = {
          times: time
        }
        Vue.set(state.board,indexName, times)
      }else{
        if(!state.board[parms.keyName].times[parms.c]){
          Vue.set(state.board[indexName].times,parms.c, parms.time)
        }
      }
    }
  },
  actions: {
    finishTime ({commit,state},parms) {
      state.board[parms.keyName].times[parms.c] = 0
    },
  }
})