<template>
  <div id="app">
    <div class="container">
      <div class="boardChess">
        <board v-bind:vs-ia="vsIA"></board>
      </div>
      <div class="historyChess">
        <board-history></board-history>
      </div>
    </div>
    <div class="container">
      <board v-bind:vs-ia="vsIAWorker" :mode="mode"></board>
    </div>
    <div class="container">
      <board></board>
    </div>
  </div>
</template>



<script>
import board from './stories/components/chessboard/board.vue';
import BoardHistory from './stories/components/boardHistory/boardHistory.vue'

export default {
  name: 'app',
  data () {
    return {
      vsIA: {isVsIA: true, color: 'all', delay: 1000, mode: 'random'},
      vsIAWorker: {isVsIA: true, color: 'all', delay: 2000, mode: 'worker'},
      mode: {'white':false,'black':false}
    }
  },
  components:{
    board,
    BoardHistory
  }
}
</script>

<style>

.container{
  width: 100%;
  float: left;
  padding: 10px;
}
.boardChess{
  float: left;
}
.historyChess{
  padding-left: 20px;
  float: left;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
