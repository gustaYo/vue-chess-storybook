import Vue from 'vue'
import Vuex from 'vuex';
import deepmerge from 'deepmerge';
var timeWorkersStore = {}
import timerCountDown from 'worker-loader!./timeWorker.js';
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
    actionW ({commit,state},parms) {
      timeWorkersStore[parms.keyName].postMessage(JSON.stringify(parms));
    }
  },
  actions: {
    finishTime ({state},parms) {
      state.board[parms.keyName].times[parms.c] = 0
    },
    destroy ({state}, parms) {
      if(timeWorkersStore[parms.keyName]){
        timeWorkersStore[parms.keyName].terminate()
        timeWorkersStore[parms.keyName] = null
        delete timeWorkersStore[parms.keyName]
      }
    },
    initTime ({commit,state}, parms) {
      var indexName = parms.keyName
      var times = {
        times: {
          [parms.c]: parms.time
        }
      }
      if(!state.board[indexName]){
        Vue.set(state.board,indexName, times)
      }else{        
        Vue.set(state.board,indexName, deepmerge({times: state.board[indexName].times || {} } , times))        
      }      
      if (!timeWorkersStore[indexName]) {
        var worker = new timerCountDown()
        worker.addEventListener(
          'message',
          (e) => {
            var data = JSON.parse(e.data)
            commit('changeTime',{keyName: indexName,c: data.c, time: data.time})
          }
          )
        timeWorkersStore[indexName] = worker
        var pp = {
          keyName: indexName,
          fun: 'setTime',
          arg: {
            [parms.c]: parms.time
          }
        }
        commit('actionW',pp)
        setTimeout(()=>{
          if (parms.active) {
            commit('actionW',{keyName: indexName, c: parms.c, fun: 'start', arg: parms.c})
          }
        },2)
      }else{
        commit('actionW',{keyName: indexName, fun: 'stop'})
        setTimeout(()=>{
          var pp = {
            keyName: indexName,
            fun: 'setTime',
            arg: {
              [parms.c]: parms.time
            }
          }
          commit('actionW',pp)
          if (parms.active) {
            commit('actionW',{keyName: indexName, c: parms.c, fun: 'start', arg: parms.c})
          }
        },2)
      }      
    }
  }
})