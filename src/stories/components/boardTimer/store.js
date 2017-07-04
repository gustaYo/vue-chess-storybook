import Vue from 'vue'
import Vuex from 'vuex';
import deepmerge from 'deepmerge';
var timesLoop = {}
export const store = new Vuex.Store({
  state: {
    board:{},
    count: 12
  },
  mutations: {
    countDown (state, parms) {
      try{
        var newVal=state.board[parms.keyName].times[parms.c] - 1
        Vue.set(state.board[parms.keyName].times,parms.c, newVal)
      }
      catch (err){
        console.log('keyName not found')
      }
    },
    updateStateBoard (state, newState) {
      Vue.set(state,'board', deepmerge(state.board, newState))
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
    countDown ({dispatch, commit, state},parms) {
      clearInterval(timesLoop[parms.keyName])
      timesLoop[parms.keyName]= setInterval(() =>
      {
        commit('countDown',parms)
        if(state.board[parms.keyName].times[parms.c] <=0) {
          parms.time = 0
          dispatch('finishTime',parms)
        }
      }
      , 1000);
    },
    finishTime ({commit,state},parms) {
      state.board[parms.keyName].times[parms.c] = 0
      clearInterval(timesLoop[parms.keyName])
      timesLoop[parms.keyName] = null
      delete timesLoop[parms.keyName] 
    },
    stopCountDown ({commit},parms) {
      clearInterval(timesLoop[parms.keyName])
    }
  }
})